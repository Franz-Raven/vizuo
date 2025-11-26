package com.vizuo.backend.service;

import com.vizuo.backend.entity.Keyword;
import com.vizuo.backend.repository.KeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class KeywordService {

    @Autowired
    private KeywordRepository keywordRepository;

    public Set<Keyword> resolveKeywords(List<String> keywordNames) {
        if (keywordNames == null || keywordNames.isEmpty()) {
            return new HashSet<>();
        }

        Set<Keyword> result = new HashSet<>();

        for (String raw : keywordNames) {
            if (raw == null) continue;

            String normalized = raw.trim();
            if (normalized.isEmpty()) continue;

            Optional<Keyword> existing = keywordRepository.findByNameIgnoreCase(normalized);

            if (existing.isPresent()) {
                result.add(existing.get());
            } else {
                Keyword keyword = new Keyword(normalized);
                keywordRepository.save(keyword);
                result.add(keyword);
            }
        }

        return result;
    }

    public List<String> toNameList(Set<Keyword> keywordEntities) {
        if (keywordEntities == null) return new ArrayList<>();
        return keywordEntities.stream()
                .map(Keyword::getName)
                .collect(Collectors.toList());
    }
}
