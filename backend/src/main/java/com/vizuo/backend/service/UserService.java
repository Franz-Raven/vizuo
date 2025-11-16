package com.vizuo.backend.service;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

        // Check username uniqueness if username is being changed
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

    public String uploadImage(MultipartFile file, String type) {
        // For now, return a mock URL
        // In production, you would:
        // 1. Generate a unique filename
        // 2. Save the file to your storage system
        // 3. Return the public URL

        if ("avatar".equals(type)) {
            return "https://i.pravatar.cc/150?img=" + (int)(Math.random() * 70);
        } else {
            return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop";
        }
    }
}