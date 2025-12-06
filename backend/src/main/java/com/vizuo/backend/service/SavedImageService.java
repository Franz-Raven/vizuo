package com.vizuo.backend.service;

import com.vizuo.backend.dto.SavedImageResponse;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.SavedImage;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.SavedImageRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedImageService {

    @Autowired
    private SavedImageRepository savedImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    public SavedImageResponse saveImage(Long userId, Long imageId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image not found"));

        return savedImageRepository.findByUserAndImage(user, image)
                .map(this::toResponse)
                .orElseGet(() -> {
                    SavedImage savedImage = new SavedImage(user, image);
                    SavedImage saved = savedImageRepository.save(savedImage);
                    return toResponse(saved);
                });
    }

    public void unsaveImage(Long userId, Long imageId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new RuntimeException("Image not found"));

        savedImageRepository.findByUserAndImage(user, image)
                .ifPresent(savedImageRepository::delete);
    }

    public List<SavedImageResponse> getSavedImages(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return savedImageRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SavedImageResponse> getSavedImagesByIds(Long userId, List<Long> ids) {
        User user = userRepository.findById(userId).orElseThrow();
        return savedImageRepository.findAllById(ids)
                .stream()
                .filter(si -> si.getUser().getId().equals(userId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SavedImageResponse toResponse(SavedImage savedImage) {
        SavedImageResponse res = new SavedImageResponse();
        res.setId(savedImage.getId());
        res.setImageId(savedImage.getImage().getId());
        res.setThumbnailUrl(savedImage.getImage().getThumbnailUrl());
        res.setTitle(savedImage.getImage().getFileName());
        // Set creator as the original uploader of the image, not the person who saved it
        res.setCreator(savedImage.getImage().getUser().getUsername());
        res.setAddedAt(savedImage.getAddedAt());
        return res;
    }
}
