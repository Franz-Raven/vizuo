package com.vizuo.backend.service;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
}