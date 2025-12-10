package com.vizuo.backend.service;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.vizuo.backend.repository.LikeRepository;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.dto.ProfileAssetDTO;
import com.vizuo.backend.repository.SavedImageRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final LikeRepository likeRepository;
    private final SavedImageRepository savedImageRepository;

    public UserService(UserRepository userRepository, ImageRepository imageRepository, LikeRepository likeRepository, SavedImageRepository savedImageRepository) {
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
        this.likeRepository = likeRepository;
        this.savedImageRepository = savedImageRepository;
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
    
    // isSpaceItem = true
    return savedImageRepository.findByUser(user).stream()
            .filter(savedImage -> savedImage.isSpaceItem()) 
            .map(savedImage -> {
                Image image = savedImage.getImage();
                
                return ProfileAssetDTO.builder()
                    .id(savedImage.getId()) 
                    .imageUrl(image.getThumbnailUrl())
                    .title(image.getFileName())
                    .type("space")
                    .createdAt(savedImage.getAddedAt() != null ? 
                              savedImage.getAddedAt().toString() : "")
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