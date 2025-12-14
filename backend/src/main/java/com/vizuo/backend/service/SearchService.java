package com.vizuo.backend.service;

import com.vizuo.backend.dto.AttachmentInfo;
import com.vizuo.backend.dto.FeedResponse;
import com.vizuo.backend.dto.ImageResponse;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.Keyword;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.KeywordRepository;
import com.vizuo.backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SearchService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private KeywordService keywordService;

    @Autowired
    private LikeService likeService;

    private static final int TOP_TOKENS = 30;
    private static final int CANDIDATE_CAP = 3000;
    private static final int FEED_SNAPSHOT_CAP = 1000;
    private static final long FEED_TTL_MILLIS = 15 * 60 * 1000L;

    private static final Set<String> STOPWORDS = Set.of(
            "of", "the", "a", "an", "and", "or", "in", "on", "for", "to", "with", "at", "by", "from", "is", "are", "was", "were"
    );

    private final Map<String, SearchSession> sessions = new ConcurrentHashMap<>();

    private static class SearchSession {
        private final List<Long> rankedIds;
        private final long expiresAtMillis;

        private SearchSession(List<Long> rankedIds, long expiresAtMillis) {
            this.rankedIds = rankedIds;
            this.expiresAtMillis = expiresAtMillis;
        }
    }

    private static class ParsedCursor {
        private final String sessionId;
        private final int offset;

        private ParsedCursor(String sessionId, int offset) {
            this.sessionId = sessionId;
            this.offset = offset;
        }
    }

    private static class Scored {
        private final Long id;
        private final double score;

        private Scored(Long id, double score) {
            this.id = id;
            this.score = score;
        }
    }

    public FeedResponse<ImageResponse> searchFeed(Long currentUserId, String query, int limit, String cursor) {
        if (limit <= 0) limit = 15;

        cleanupExpiredSessions();

        String normalizedQuery = normalizeQuery(query);
        if (normalizedQuery.isBlank()) {
            return new FeedResponse<>(List.of(), null);
        }

        String sessionId;
        int offset;

        if (cursor == null || cursor.isBlank()) {
            sessionId = UUID.randomUUID().toString();
            offset = 0;
            List<Long> rankedIds = buildRankedSearchIds(currentUserId, normalizedQuery);
            sessions.put(sessionId, new SearchSession(rankedIds, System.currentTimeMillis() + FEED_TTL_MILLIS));
        } else {
            ParsedCursor parsed = parseCursor(cursor);
            if (parsed == null) {
                sessionId = UUID.randomUUID().toString();
                offset = 0;
                List<Long> rankedIds = buildRankedSearchIds(currentUserId, normalizedQuery);
                sessions.put(sessionId, new SearchSession(rankedIds, System.currentTimeMillis() + FEED_TTL_MILLIS));
            } else {
                sessionId = parsed.sessionId;
                offset = parsed.offset;
                SearchSession existing = sessions.get(sessionId);
                if (existing == null || existing.expiresAtMillis < System.currentTimeMillis()) {
                    sessionId = UUID.randomUUID().toString();
                    offset = 0;
                    List<Long> rankedIds = buildRankedSearchIds(currentUserId, normalizedQuery);
                    sessions.put(sessionId, new SearchSession(rankedIds, System.currentTimeMillis() + FEED_TTL_MILLIS));
                }
            }
        }

        SearchSession session = sessions.get(sessionId);
        if (session == null || session.rankedIds == null || session.rankedIds.isEmpty()) {
            return new FeedResponse<>(List.of(), null);
        }

        int from = Math.min(offset, session.rankedIds.size());
        int to = Math.min(offset + limit, session.rankedIds.size());
        List<Long> pageIds = session.rankedIds.subList(from, to);

        List<Image> images = imageRepository.findAllById(pageIds);
        Map<Long, Image> byId = new HashMap<>();
        for (Image img : images) byId.put(img.getId(), img);

        List<ImageResponse> items = new ArrayList<>();
        for (Long id : pageIds) {
            Image img = byId.get(id);
            if (img != null && Boolean.TRUE.equals(img.getStatus())) {
                items.add(toResponse(img, currentUserId));
            }
        }

        String nextCursor = (to >= session.rankedIds.size()) ? null : makeCursor(sessionId, to);
        return new FeedResponse<>(items, nextCursor);
    }

    private List<Long> buildRankedSearchIds(Long currentUserId, String normalizedQuery) {
        Set<Long> likedSet = new HashSet<>();
        if (currentUserId != null) {
            List<Long> likedImageIds = likeRepository.findLikedImageIdsByUserId(currentUserId);
            likedSet.addAll(likedImageIds);
        }

        List<String> tokens = tokenize(normalizedQuery);
        if (tokens.isEmpty()) {
            List<Image> popular = imageRepository.findPopularStatusTrue(
                    List.of(),
                    true,
                    PageRequest.of(0, FEED_SNAPSHOT_CAP)
            );
            List<Long> ids = new ArrayList<>();
            for (Image img : popular) ids.add(img.getId());
            return ids;
        }

        if (tokens.size() > TOP_TOKENS) {
            tokens = tokens.subList(0, TOP_TOKENS);
        }

        Map<Long, Double> keywordWeights = buildQueryKeywordWeights(tokens);
        List<Long> keywordIds = new ArrayList<>(keywordWeights.keySet());

        LinkedHashMap<Long, Image> candidateMap = new LinkedHashMap<>();

        if (!keywordIds.isEmpty()) {
            List<Image> byKeywords = imageRepository.findCandidatesByKeywordIds(
                    keywordIds,
                    List.of(),
                    true,
                    PageRequest.of(0, CANDIDATE_CAP)
            );
            for (Image img : byKeywords) candidateMap.putIfAbsent(img.getId(), img);
        }

        List<Image> byText = imageRepository.findCandidatesByTextQuery(
                normalizedQuery,
                List.of(),
                true,
                PageRequest.of(0, CANDIDATE_CAP)
        );
        for (Image img : byText) candidateMap.putIfAbsent(img.getId(), img);

        List<Image> candidates = new ArrayList<>(candidateMap.values());

        if (candidates.isEmpty()) {
            List<Image> popular = imageRepository.findPopularStatusTrue(
                    List.of(),
                    true,
                    PageRequest.of(0, FEED_SNAPSHOT_CAP)
            );
            List<Long> ids = new ArrayList<>();
            for (Image img : popular) ids.add(img.getId());
            return ids;
        }

        if (candidates.size() > CANDIDATE_CAP) {
            candidates = candidates.subList(0, CANDIDATE_CAP);
        }

        List<Long> candidateIds = new ArrayList<>();
        for (Image img : candidates) candidateIds.add(img.getId());

        Map<Long, Long> likeCounts = toLikeCountMap(likeRepository.countLikesForImageIds(candidateIds));

        LocalDateTime now = LocalDateTime.now();
        List<Scored> scored = new ArrayList<>();

        for (Image img : candidates) {
            double keywordRelevance = 0.0;
            if (img.getKeywords() != null) {
                for (Keyword k : img.getKeywords()) {
                    if (k == null || k.getId() == null) continue;
                    Double w = keywordWeights.get(k.getId());
                    if (w != null) keywordRelevance += w;
                }
            }

            double textScore = computeTextScore(img, normalizedQuery, tokens);

            double freshness = 0.0;
            if (img.getCreatedAt() != null) {
                long hours = Math.max(0, Duration.between(img.getCreatedAt(), now).toHours());
                freshness = Math.exp(-hours / 168.0);
            }

            long likes = likeCounts.getOrDefault(img.getId(), 0L);
            double popularity = Math.log1p(likes);

            double premiumBoost = Boolean.TRUE.equals(img.getPremium()) ? 0.10 : 0.0;

            double likedPenalty = likedSet.contains(img.getId()) ? -0.4 : 0.0;

            double finalScore =
                    (textScore * 1.0) +
                    (keywordRelevance * 0.60) +
                    (freshness * 0.20) +
                    (popularity * 0.15) +
                    premiumBoost +
                    likedPenalty;

            System.out.printf(
                    "SEARCH IMG %d | text=%.4f | kw=%.4f | fresh=%.4f | pop=%.4f | prem=%.2f | likedPenalty=%.2f | FINAL=%.4f%n",
                    img.getId(),
                    textScore,
                    keywordRelevance,
                    freshness,
                    popularity,
                    premiumBoost,
                    likedPenalty,
                    finalScore
            );

            scored.add(new Scored(img.getId(), finalScore));
        }

        scored.sort((a, b) -> Double.compare(b.score, a.score));

        List<Long> rankedIds = new ArrayList<>();
        for (Scored s : scored) rankedIds.add(s.id);

        if (rankedIds.size() < FEED_SNAPSHOT_CAP) {
            Set<Long> exclude = new HashSet<>(rankedIds);

            List<Image> backfill = imageRepository.findPopularStatusTrue(
                    List.of(),
                    true,
                    PageRequest.of(0, FEED_SNAPSHOT_CAP)
            );

            for (Image img : backfill) {
                if (rankedIds.size() >= FEED_SNAPSHOT_CAP) break;
                if (!exclude.contains(img.getId())) {
                    rankedIds.add(img.getId());
                    exclude.add(img.getId());
                }
            }
        }

        if (rankedIds.size() > FEED_SNAPSHOT_CAP) {
            return rankedIds.subList(0, FEED_SNAPSHOT_CAP);
        }

        return rankedIds;
    }

    private Map<Long, Double> buildQueryKeywordWeights(List<String> tokens) {
        Map<Long, Double> weights = new HashMap<>();
        if (tokens == null || tokens.isEmpty()) return weights;

        List<Keyword> matched = keywordRepository.findByNameInIgnoreCase(tokens);
        for (Keyword k : matched) {
            if (k == null || k.getId() == null) continue;
            weights.put(k.getId(), 1.0);
        }

        return weights;
    }

    private double computeTextScore(Image img, String normalizedQuery, List<String> tokens) {
        String title = img.getFileName() == null ? "" : img.getFileName().toLowerCase();
        String desc = img.getDescription() == null ? "" : img.getDescription().toLowerCase();

        double score = 0.0;

        boolean phraseMatch = (!normalizedQuery.isBlank() && (title.contains(normalizedQuery) || desc.contains(normalizedQuery)));
        if (phraseMatch) score += 2.0;

        int tokenHits = 0;
        for (String t : tokens) {
            if (t == null || t.isBlank()) continue;
            if (title.contains(t) || desc.contains(t)) tokenHits++;
        }

        score += tokenHits * 0.35;

        return score;
    }

    private String normalizeQuery(String q) {
        if (q == null) return "";
        String s = q.trim().toLowerCase();
        s = s.replaceAll("[^a-z0-9\\s]", " ");
        s = s.replaceAll("\\s+", " ").trim();
        return s;
    }

    private List<String> tokenize(String normalizedQuery) {
        if (normalizedQuery == null || normalizedQuery.isBlank()) return List.of();
        String[] parts = normalizedQuery.split("\\s+");
        List<String> out = new ArrayList<>();
        for (String p : parts) {
            if (p == null) continue;
            String t = p.trim();
            if (t.isBlank()) continue;
            if (t.length() < 2) continue;
            if (STOPWORDS.contains(t)) continue;
            out.add(t);
        }
        return out;
    }

    private String makeCursor(String sessionId, int offset) {
        return sessionId + ":" + offset;
    }

    private ParsedCursor parseCursor(String cursor) {
        try {
            String[] parts = cursor.split(":", 2);
            if (parts.length != 2) return null;
            String sid = parts[0];
            int off = Integer.parseInt(parts[1]);
            if (sid.isBlank() || off < 0) return null;
            return new ParsedCursor(sid, off);
        } catch (Exception e) {
            return null;
        }
    }

    private void cleanupExpiredSessions() {
        long now = System.currentTimeMillis();
        sessions.entrySet().removeIf(e -> e.getValue().expiresAtMillis < now);
    }

    private Map<Long, Long> toLikeCountMap(List<Object[]> rows) {
        Map<Long, Long> map = new HashMap<>();
        for (Object[] r : rows) {
            Long imageId = (Long) r[0];
            Long count = (Long) r[1];
            map.put(imageId, count);
        }
        return map;
    }

    private ImageResponse toResponse(Image image, Long currentUserId) {
        long likesCount = likeService.getLikeCountForImage(image.getId());
        String uploaderUsername = image.getUser() != null ? image.getUser().getUsername() : null;
        String uploaderAvatar = image.getUser() != null ? image.getUser().getAvatar() : null;
        boolean likedByCurrentUser = currentUserId != null &&
                likeService.hasUserLikedImage(image.getId(), currentUserId);
        List<AttachmentInfo> attachments = buildAttachmentInfoList(image);

        return new ImageResponse(
                image.getId(),
                image.getFileName(),
                image.getDescription(),
                keywordService.toNameList(image.getKeywords()),
                image.getThumbnailUrl(),
                attachments,
                image.getPremium(),
                image.getCreatedAt(),
                likesCount,
                uploaderUsername,
                uploaderAvatar,
                likedByCurrentUser);
    }

    private List<AttachmentInfo> buildAttachmentInfoList(Image image) {
        List<AttachmentInfo> result = new ArrayList<>();
        if (image.getAttachments() != null) {
            for (var attachment : image.getAttachments()) {
                result.add(new AttachmentInfo(attachment.getUrl(), attachment.getFormat()));
            }
        }
        return result;
    }
}
