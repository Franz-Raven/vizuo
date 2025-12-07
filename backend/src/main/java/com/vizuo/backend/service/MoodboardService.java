package com.vizuo.backend.service;

import com.vizuo.backend.dto.MoodboardCreateRequest;
import com.vizuo.backend.dto.MoodboardResponse;
import com.vizuo.backend.entity.Moodboard;
import com.vizuo.backend.entity.MoodboardSave;
import com.vizuo.backend.entity.SavedImage;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.MoodboardRepository;
import com.vizuo.backend.repository.MoodboardSaveRepository;
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

    @Autowired
    private MoodboardSaveRepository moodboardSaveRepository;

    public MoodboardResponse createMoodboard(Long userId, MoodboardCreateRequest req) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Moodboard moodboard = new Moodboard(
                user,
                req.getName(),
                req.getDescription(),
                req.getIsPrivate()
        );

        Moodboard saved = moodboardRepository.save(moodboard);
        return toResponse(saved, userId);
    }

    public List<MoodboardResponse> getMoodboards(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return moodboardRepository.findByUser(user)
                .stream()
                .map(m -> toResponse(m, userId))
                .collect(Collectors.toList());
    }

    public List<MoodboardResponse> getPublicMoodboards(Long userId, String search) {
        List<Moodboard> moodboards = moodboardRepository.findAll();
        
        return moodboards.stream()
                .filter(m -> !m.getPrivate())
                .filter(m -> search == null || search.isEmpty() || 
                            m.getName().toLowerCase().contains(search.toLowerCase()))
                .map(m -> toResponse(m, userId))
                .collect(Collectors.toList());
    }

    public List<MoodboardResponse> getSavedMoodboards(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<MoodboardSave> saves = moodboardSaveRepository.findByUser(user);
        
        return saves.stream()
                .map(save -> toResponse(save.getMoodboard(), userId))
                .collect(Collectors.toList());
    }

    public void saveMoodboard(Long userId, Long moodboardId) {
        User user = userRepository.findById(userId).orElseThrow();
        Moodboard moodboard = moodboardRepository.findById(moodboardId).orElseThrow();
        
        if (!moodboardSaveRepository.existsByUserAndMoodboard(user, moodboard)) {
            MoodboardSave save = new MoodboardSave(user, moodboard);
            moodboardSaveRepository.save(save);
        }
    }

    public void unsaveMoodboard(Long userId, Long moodboardId) {
        User user = userRepository.findById(userId).orElseThrow();
        Moodboard moodboard = moodboardRepository.findById(moodboardId).orElseThrow();
        
        moodboardSaveRepository.findByUserAndMoodboard(user, moodboard)
                .ifPresent(moodboardSaveRepository::delete);
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
        return toResponse(updated, userId);
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
        return toResponse(updated, userId);
    }

    public MoodboardResponse getMoodboardById(Long userId, Long moodboardId) {
        Moodboard moodboard = moodboardRepository.findById(moodboardId)
                .orElseThrow(() -> new RuntimeException("Moodboard not found"));
        
        // Check if user has access (public or owner)
        if (moodboard.getPrivate() && !moodboard.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        return toResponse(moodboard, userId);
    }

    public MoodboardResponse updateMoodboard(Long userId, Long moodboardId, MoodboardCreateRequest req) {
        Moodboard moodboard = moodboardRepository.findById(moodboardId)
                .orElseThrow(() -> new RuntimeException("Moodboard not found"));
        
        // Only owner can update
        if (!moodboard.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        moodboard.setName(req.getName());
        moodboard.setDescription(req.getDescription());
        if (req.getIsPrivate() != null) {
            moodboard.setPrivate(req.getIsPrivate());
        }
        
        Moodboard updated = moodboardRepository.save(moodboard);
        return toResponse(updated, userId);
    }

    public void deleteMoodboard(Long userId, Long moodboardId) {
        Moodboard moodboard = moodboardRepository.findById(moodboardId)
                .orElseThrow(() -> new RuntimeException("Moodboard not found"));
        
        // Only owner can delete
        if (!moodboard.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Delete all saves first
        moodboardSaveRepository.deleteByMoodboard(moodboard);
        
        // Delete the moodboard
        moodboardRepository.delete(moodboard);
    }

    public MoodboardResponse reorderImages(Long userId, Long moodboardId, List<Long> savedImageIds) {
        Moodboard moodboard = moodboardRepository.findById(moodboardId)
                .orElseThrow(() -> new RuntimeException("Moodboard not found"));
        
        // Only owner can reorder
        if (!moodboard.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Verify all images belong to user and are in the moodboard
        Set<SavedImage> currentImages = moodboard.getSavedImages();
        Set<Long> currentImageIds = currentImages.stream()
                .map(SavedImage::getId)
                .collect(Collectors.toSet());
        
        for (Long imageId : savedImageIds) {
            if (!currentImageIds.contains(imageId)) {
                throw new RuntimeException("Image not in moodboard");
            }
        }
        
        // Clear and re-add in new order
        moodboard.getSavedImages().clear();
        for (Long imageId : savedImageIds) {
            SavedImage img = savedImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));
            moodboard.getSavedImages().add(img);
        }
        
        Moodboard updated = moodboardRepository.save(moodboard);
        return toResponse(updated, userId);
    }

    private MoodboardResponse toResponse(Moodboard moodboard, Long currentUserId) {
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

        // User info
        res.setUserId(moodboard.getUser().getId());
        res.setUsername(moodboard.getUser().getUsername());

        // Save count
        long saveCount = moodboardSaveRepository.countByMoodboard(moodboard);
        res.setSaveCount(saveCount);

        // Is saved by current user
        User currentUser = userRepository.findById(currentUserId).orElse(null);
        boolean isSaved = currentUser != null && 
                         moodboardSaveRepository.existsByUserAndMoodboard(currentUser, moodboard);
        res.setIsSaved(isSaved);

        // Preview images (first 4 thumbnails)
        List<String> previewImages = moodboard.getSavedImages()
                .stream()
                .map(SavedImage::getImage)
                .filter(img -> img != null && img.getThumbnailUrl() != null)
                .map(img -> img.getThumbnailUrl())
                .limit(4)
                .collect(Collectors.toList());
        res.setPreviewImages(previewImages);

        return res;
    }
}
