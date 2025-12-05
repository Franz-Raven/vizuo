package com.vizuo.backend.service;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
}