package com.vizuo.backend.service;

import com.vizuo.backend.dto.MoodboardCreateRequest;
import com.vizuo.backend.dto.MoodboardResponse;
import com.vizuo.backend.entity.Moodboard;
import com.vizuo.backend.entity.SavedImage;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.MoodboardRepository;
import com.vizuo.backend.repository.SavedImageRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MoodboardService {

    @Autowired
    private MoodboardRepository moodboardRepository;

    @Autowired
    private SavedImageRepository savedImageRepository;

    @Autowired
    private UserRepository userRepository;

    public MoodboardResponse createMoodboard(Long userId, MoodboardCreateRequest req) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Moodboard moodboard = new Moodboard(
                user,
                req.getName(),
                req.getDescription(),
                req.getIsPrivate()
        );

        Moodboard saved = moodboardRepository.save(moodboard);
        return toResponse(saved);
    }

    public List<MoodboardResponse> getMoodboards(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return moodboardRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MoodboardResponse assignSavedImages(Long userId, Long moodboardId, List<Long> savedImageIds) {
        Moodboard moodboard = moodboardRepository.findById(moodboardId).orElseThrow(() -> new RuntimeException("Moodboard not found"));
        if (!moodboard.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Set<SavedImage> current = moodboard.getSavedImages();

        for (Long savedImageId : savedImageIds) {
            SavedImage savedImage = savedImageRepository.findById(savedImageId).orElseThrow();
            if (!savedImage.getUser().getId().equals(userId)) {
                throw new RuntimeException("Unauthorized saved image");
            }
            current.add(savedImage);
        }

        moodboard.setSavedImages(current);
        Moodboard updated = moodboardRepository.save(moodboard);
        return toResponse(updated);
    }

    public MoodboardResponse removeSavedImage(Long userId, Long moodboardId, Long savedImageId) {
        Moodboard moodboard = moodboardRepository.findById(moodboardId).orElseThrow(() -> new RuntimeException("Moodboard not found"));
        if (!moodboard.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        SavedImage savedImage = savedImageRepository.findById(savedImageId).orElseThrow();
        if (!savedImage.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized saved image");
        }

        moodboard.getSavedImages().remove(savedImage);
        Moodboard updated = moodboardRepository.save(moodboard);
        return toResponse(updated);
    }

    private MoodboardResponse toResponse(Moodboard moodboard) {
        MoodboardResponse res = new MoodboardResponse();
        res.setId(moodboard.getId());
        res.setName(moodboard.getName());
        res.setDescription(moodboard.getDescription());
        res.setIsPrivate(moodboard.getPrivate());
        res.setCreatedAt(moodboard.getCreatedAt());

        List<Long> savedImageIds = moodboard.getSavedImages()
                .stream()
                .map(SavedImage::getId)
                .collect(Collectors.toList());
        res.setSavedImageIds(savedImageIds);

        return res;
    }
}
