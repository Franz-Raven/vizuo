package com.vizuo.backend.service;

import com.vizuo.backend.dto.AttachmentInfo;
import com.vizuo.backend.dto.FeedResponse;
import com.vizuo.backend.dto.ImageResponse;
import com.vizuo.backend.dto.UploadResponse;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.ImageAttachment;
import com.vizuo.backend.entity.Keyword;
import com.vizuo.backend.entity.Like;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.LikeRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private KeywordService keywordService;

    @Autowired
    private LikeService likeService;

    private static final int RECENT_LIKES_WINDOW = 20;
    private static final int TOP_KEYWORDS = 30;
    private static final int CANDIDATE_CAP = 3000;
    private static final int FEED_SNAPSHOT_CAP = 1000;
    private static final long FEED_TTL_MILLIS = 15 * 60 * 1000L;

    private static final Set<String> GENERIC_KEYWORDS = Set.of(
            "logo", "design", "png", "jpg", "jpeg", "photo", "image", "vector", "icon", "template", "graphic", "art"
    );

    private final Map<String, FeedSession> feedSessions = new ConcurrentHashMap<>();

    private static class FeedSession {
        private final List<Long> rankedIds;
        private final long expiresAtMillis;

        private FeedSession(List<Long> rankedIds, long expiresAtMillis) {
            this.rankedIds = rankedIds;
            this.expiresAtMillis = expiresAtMillis;
        }
    }

    public UploadResponse uploadImage(
            String email,
            String fileName,
            String description,
            List<String> keywords,
            List<MultipartFile> previewFiles,
            List<MultipartFile> attachmentFiles,
            Boolean isPremium) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = new Image(user, fileName, description);

        Set<Keyword> keywordEntities = keywordService.resolveKeywords(keywords);
        image.setKeywords(keywordEntities);
        image.setPremium(isPremium != null && isPremium);
        String thumbnailUrl = null;
        if (previewFiles != null && !previewFiles.isEmpty()) {
            try {
                CloudinaryUploadResult uploadResult = cloudinaryService.uploadImageWithMeta(previewFiles.get(0), "thumbnails");
                thumbnailUrl = uploadResult.getUrl();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload thumbnail: " + e.getMessage());
            }
        }
        image.setThumbnailUrl(thumbnailUrl);

        List<ImageAttachment> attachments = new ArrayList<>();
        if (attachmentFiles != null && !attachmentFiles.isEmpty()) {
            for (MultipartFile file : attachmentFiles) {
                try {
                    CloudinaryUploadResult uploadResult = cloudinaryService.uploadImageWithMeta(file, "attachments");
                    attachments.add(new ImageAttachment(uploadResult.getUrl(), uploadResult.getFormat()));
                } catch (Exception e) {
                    throw new RuntimeException("Failed to upload attachment: " + e.getMessage());
                }
            }
        }
        image.setAttachments(attachments);

        Image savedImage = imageRepository.save(image);

        return new UploadResponse(
            savedImage.getId(),
            savedImage.getFileName(),
            savedImage.getDescription(),
            keywordService.toNameList(savedImage.getKeywords()),
            savedImage.getThumbnailUrl(),
            buildAttachmentInfoList(savedImage),
            savedImage.getPremium(),
            savedImage.getCreatedAt(),
            savedImage.getUser().getUsername(),
            savedImage.getUser().getAvatar(),
            true,
            "Upload successful"
        );
    }

    public List<ImageResponse> getUserImages(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Image> images = imageRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<ImageResponse> responses = new ArrayList<>();

        for (Image image : images) {
            responses.add(toResponse(image));
        }

        return responses;
    }

    public ImageResponse getImageById(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        return toResponse(image);
    }

    public void deleteImage(Long id, String email) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!image.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this image");
        }

        likeService.removeAllLikesForImage(image.getId());
        imageRepository.delete(image);
    }

    public List<ImageResponse> getFeedImages(Long currentUserId) {
        List<Image> images = imageRepository.findAll();
        images.removeIf(img -> img.getStatus() == null || !img.getStatus());
        images.sort(Comparator.comparing(Image::getCreatedAt).reversed());

        List<ImageResponse> responses = new ArrayList<>();
        for (Image image : images) {
            responses.add(toResponse(image, currentUserId));
        }

        return responses;
    }

    public FeedResponse<ImageResponse> getPersonalizedFeed(Long currentUserId, int limit, String cursor) {
        if (limit <= 0) limit = 15;

        cleanupExpiredSessions();

        String sessionId;
        int offset;

        if (cursor == null || cursor.isBlank()) {
            sessionId = UUID.randomUUID().toString();
            offset = 0;
            List<Long> rankedIds = buildRankedFeedIds(currentUserId);
            feedSessions.put(sessionId, new FeedSession(rankedIds, System.currentTimeMillis() + FEED_TTL_MILLIS));
        } else {
            ParsedCursor parsed = parseCursor(cursor);
            if (parsed == null) {
                sessionId = UUID.randomUUID().toString();
                offset = 0;
                List<Long> rankedIds = buildRankedFeedIds(currentUserId);
                feedSessions.put(sessionId, new FeedSession(rankedIds, System.currentTimeMillis() + FEED_TTL_MILLIS));
            } else {
                sessionId = parsed.sessionId;
                offset = parsed.offset;
                FeedSession existing = feedSessions.get(sessionId);
                if (existing == null || existing.expiresAtMillis < System.currentTimeMillis()) {
                    sessionId = UUID.randomUUID().toString();
                    offset = 0;
                    List<Long> rankedIds = buildRankedFeedIds(currentUserId);
                    feedSessions.put(sessionId, new FeedSession(rankedIds, System.currentTimeMillis() + FEED_TTL_MILLIS));
                }
            }
        }

        FeedSession session = feedSessions.get(sessionId);
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

    private static class ParsedCursor {
        private final String sessionId;
        private final int offset;

        private ParsedCursor(String sessionId, int offset) {
            this.sessionId = sessionId;
            this.offset = offset;
        }
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
        feedSessions.entrySet().removeIf(e -> e.getValue().expiresAtMillis < now);
    }

    private List<Long> buildRankedFeedIds(Long currentUserId) {
        Set<Long> likedSet = new HashSet<>();
        if (currentUserId != null) {
            List<Long> likedImageIds = likeRepository.findLikedImageIdsByUserId(currentUserId);
            likedSet.addAll(likedImageIds);
        }
        System.out.println("LIKED IDS = " + likedSet);
        
        if (currentUserId == null) {
            List<Image> popular = imageRepository.findPopularStatusTrue(
                    List.of(),
                    true,
                    PageRequest.of(0, FEED_SNAPSHOT_CAP)
            );
            List<Long> ids = new ArrayList<>();
            for (Image img : popular) ids.add(img.getId());
            return ids;
        }

        List<Like> recentLikes = likeRepository.findByUser_IdOrderByCreatedAtDesc(
                currentUserId,
                PageRequest.of(0, RECENT_LIKES_WINDOW)
        );

        if (recentLikes.isEmpty()) {
            List<Image> popular = imageRepository.findPopularStatusTrue(
                    List.of(),
                    true,
                    PageRequest.of(0, FEED_SNAPSHOT_CAP)
            );
            List<Long> ids = new ArrayList<>();
            for (Image img : popular) ids.add(img.getId());
            return ids;
        }

        Map<Long, Double> keywordWeights = buildUserKeywordWeights(recentLikes);

        List<Map.Entry<Long, Double>> sortedKeywords = new ArrayList<>(keywordWeights.entrySet());
        sortedKeywords.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        List<Long> topKeywordIds = new ArrayList<>();
        for (int i = 0; i < Math.min(TOP_KEYWORDS, sortedKeywords.size()); i++) {
            topKeywordIds.add(sortedKeywords.get(i).getKey());
        }

        List<Image> candidates = imageRepository.findCandidatesByKeywordIds(
                topKeywordIds,
                List.of(),
                true,
                PageRequest.of(0, CANDIDATE_CAP)
        );
        System.out.println(
                "CANDIDATE IDS = " +
                candidates.stream().map(Image::getId).toList()
        );

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

        List<Long> candidateIds = new ArrayList<>();
        for (Image img : candidates) candidateIds.add(img.getId());

        Map<Long, Long> likeCounts = toLikeCountMap(likeRepository.countLikesForImageIds(candidateIds));

        LocalDateTime now = LocalDateTime.now();
        List<Scored> scored = new ArrayList<>();

        for (Image img : candidates) {
            double relevance = 0.0;
            if (img.getKeywords() != null) {
                for (Keyword k : img.getKeywords()) {
                    if (k == null || k.getId() == null) continue;
                    Double w = keywordWeights.get(k.getId());
                    if (w != null) relevance += w;
                }
            }

            double freshness = 0.0;
            if (img.getCreatedAt() != null) {
                long hours = Math.max(0, Duration.between(img.getCreatedAt(), now).toHours());
                freshness = Math.exp(-hours / 168.0);
            }

            long likes = likeCounts.getOrDefault(img.getId(), 0L);
            double popularity = Math.log1p(likes);

            double premiumBoost = Boolean.TRUE.equals(img.getPremium()) ? 0.15 : 0.0;

            double likedPenalty = likedSet.contains(img.getId()) ? -0.4 : 0.0;

            double finalScore = (relevance * 1.0) + (freshness * 0.35) + (popularity * 0.20) + premiumBoost + likedPenalty;

            System.out.printf(
                    "IMG %d | relevance=%.4f | freshness=%.4f | popularity=%.4f | premium=%.2f | likedPenalty=%.2f | FINAL=%.4f%n",
                    img.getId(),
                    relevance,
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

    private static class Scored {
        private final Long id;
        private final double score;

        private Scored(Long id, double score) {
            this.id = id;
            this.score = score;
        }
    }

    private Map<Long, Double> buildUserKeywordWeights(List<Like> recentLikes) {
        Map<Long, Double> weights = new HashMap<>();
        int n = recentLikes.size();

        for (int i = 0; i < n; i++) {
            Like like = recentLikes.get(i);
            Image img = like.getImage();
            if (img == null || img.getKeywords() == null) continue;

            double recencyWeight = (double) (n - i) / (double) n;

            for (Keyword k : img.getKeywords()) {
                if (k == null || k.getId() == null) continue;

                double add = recencyWeight;

                String name = k.getName() == null ? "" : k.getName().trim().toLowerCase();
                if (!name.isEmpty() && GENERIC_KEYWORDS.contains(name)) {
                    add *= 0.2;
                }

                weights.merge(k.getId(), add, Double::sum);
            }
        }

        return weights;
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

    private ImageResponse toResponse(Image image) {
        long likesCount = likeService.getLikeCountForImage(image.getId());
        String uploaderUsername = image.getUser() != null ? image.getUser().getUsername() : null;
        String uploaderAvatar = image.getUser() != null ? image.getUser().getAvatar() : null;
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
                uploaderAvatar);
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
            for (ImageAttachment attachment : image.getAttachments()) {
                result.add(new AttachmentInfo(attachment.getUrl(), attachment.getFormat()));
            }
        }
        return result;
    }

    public ImageResponse likeImage(Long imageId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        likeService.likeImage(image, user);

        return toResponse(image, user.getId());
    }

    public ImageResponse unlikeImage(Long imageId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        likeService.unlikeImage(image, user);

        return toResponse(image, user.getId());
    }
}
