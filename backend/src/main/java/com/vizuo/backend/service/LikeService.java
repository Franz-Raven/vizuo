package com.vizuo.backend.service;

import com.vizuo.backend.repository.LikeRepository;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public long getLikeCountForImage(Long imageId) {
        return likeRepository.countByImage_Id(imageId);
    }

    public boolean hasUserLikedImage(Long imageId, Long userId) {
        return likeRepository.existsByImage_IdAndUser_Id(imageId, userId);
    }

    public void removeAllLikesForImage(Long imageId) {
        likeRepository.deleteAll(
            likeRepository.findAll().stream()
                .filter(like -> like.getImage().getId().equals(imageId))
                .toList()
        );
    }
}
