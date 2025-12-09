package com.vizuo.backend.service;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.vizuo.backend.repository.LikeRepository;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.MoodboardRepository;
import com.vizuo.backend.dto.ProfileAssetDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final LikeRepository likeRepository;
    private final MoodboardRepository moodboardRepository;

    public UserService(UserRepository userRepository, MoodboardRepository moodboardRepository, ImageRepository imageRepository, LikeRepository likeRepository) {
        this.userRepository = userRepository;
        this.moodboardRepository = moodboardRepository;
        this.imageRepository = imageRepository;
        this.likeRepository = likeRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public List<User> searchUsers(String query, Long excludeUserId) {
        return userRepository.findByUsernameContainingIgnoreCaseAndIdNot(query, excludeUserId);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllUsersExcept(Long excludeUserId) {
        return userRepository.findAllByIdNot(excludeUserId);
    }

    public User updateUserProfile(Long userId, ProfileUpdateRequest request) {
        User user = getUserById(userId);

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsernameAndIdNot(request.getUsername(), userId)) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        if (request.getCoverImage() != null) {
            user.setCoverImage(request.getCoverImage());
        }

        return userRepository.save(user);
    }

    public void updateUserImage(Long userId, String type, String imageUrl) {
        User user = getUserById(userId);
        if ("avatar".equals(type)) {
            user.setAvatar(imageUrl);
        } else if ("cover".equals(type)) {
            user.setCoverImage(imageUrl);
        }
        userRepository.save(user);
    }

// for profile assets
    public List<ProfileAssetDTO> getUserSpaceItems(Long userId) {
    User user = getUserById(userId);
    return moodboardRepository.findByUser(user).stream()
            .map(moodboard -> {
                String thumbnailUrl = "https://via.placeholder.com/300x200/333/fff?text=No+Image";
                int itemCount = 0;
                
                if (moodboard.getSavedImages() != null && !moodboard.getSavedImages().isEmpty()) {
                    thumbnailUrl = moodboard.getSavedImages().stream()
                            .findFirst()
                            .map(savedImage -> savedImage.getImage().getThumbnailUrl())
                            .orElse(thumbnailUrl);
                    itemCount = moodboard.getSavedImages().size();
                }
                
                return ProfileAssetDTO.builder()
                    .id(moodboard.getId())
                    .imageUrl(thumbnailUrl)
                    .title(moodboard.getName())
                    .type("space")
                    .createdAt(moodboard.getCreatedAt() != null ? moodboard.getCreatedAt().toString() : "")
                    .itemCount(itemCount)
                    .build();
            })
            .collect(Collectors.toList());
}

public List<ProfileAssetDTO> getUserUploads(Long userId) {
    User user = getUserById(userId);
    return imageRepository.findByUser(user).stream()
            .map(image -> {
                long likesCount = likeRepository.countByImage_Id(image.getId());
                
                return ProfileAssetDTO.builder()
                    .id(image.getId())
                    .imageUrl(image.getThumbnailUrl())
                    .title(image.getFileName())
                    .type("upload")
                    .createdAt(image.getCreatedAt() != null ? image.getCreatedAt().toString() : "")
                    .likesCount((int) likesCount)
                    .downloadsCount(0)
                    .build();
            })
            .collect(Collectors.toList());
}

public List<ProfileAssetDTO> getUserFavorites(Long userId) {
    User user = getUserById(userId);
    
    return likeRepository.findByUser(user).stream()
            .map(like -> {
                Image image = like.getImage();
                long likesCount = likeRepository.countByImage_Id(image.getId());
                
                return ProfileAssetDTO.builder()
                    .id(image.getId())
                    .imageUrl(image.getThumbnailUrl())
                    .title(image.getFileName())
                    .type("favorite")
                    .likesCount((int) likesCount)
                    .likedAt(like.getCreatedAt() != null ? like.getCreatedAt().toString() : "")
                    .uploader(image.getUser() != null ? image.getUser().getUsername() : "Unknown")
                    .build();
            })
            .collect(Collectors.toList());
}

    // combined method 
    // public Map<String, Object> getAllProfileAssets(Long userId) {
    //     return Map.of(
    //         "spaceItems", getUserSpaceItems(userId),
    //         "uploads", getUserUploads(userId),
    //         "favorites", getUserFavorites(userId)
    //     );
    // }
}