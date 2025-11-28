package com.vizuo.backend.service;

import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.Like;
import com.vizuo.backend.entity.User;
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

    public void likeImage(Image image, User user) {
        boolean alreadyLiked = hasUserLikedImage(image.getId(), user.getId());
        if (alreadyLiked) {
            return;
        }
        Like like = new Like(user, image);
        likeRepository.save(like);
    }

    public void unlikeImage(Image image, User user) {
        Like like = likeRepository
                .findByImage_IdAndUser_Id(image.getId(), user.getId())
                .orElse(null);

        if (like != null) {
            likeRepository.delete(like);
        }
    }

    public void removeAllLikesForImage(Long imageId) {
        likeRepository.deleteAll(
                likeRepository.findAll().stream()
                        .filter(like -> like.getImage().getId().equals(imageId))
                        .toList());
    }
}
