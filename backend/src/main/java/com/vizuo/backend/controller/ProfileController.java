package com.vizuo.backend.controller;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.UserService;
import com.vizuo.backend.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    public ProfileController(UserService userService, CloudinaryService cloudinaryService) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile() {
        try {
            User user = userService.getUserById(1L);

            Map<String, Object> response = new HashMap<>();
            response.put("user", mapUserToResponse(user));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        try {
            // Using first user ID for now since no authentication yet
            Long userId = 1L;
            User updatedUser = userService.updateUserProfile(userId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("user", mapUserToResponse(updatedUser));
            response.put("message", "Profile updated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        try {
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }

            String imageUrl = cloudinaryService.uploadImage(file, type);

            userService.updateUserImage(1L, type, imageUrl);

            return ResponseEntity.ok(Map.of(
                    "url", imageUrl,
                    "message", "Image uploaded successfully to Cloudinary"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("avatar", user.getAvatar() != null ? user.getAvatar() : "https://i.pinimg.com/736x/9f/4c/f0/9f4cf0f24b376077a2fcdab2e85c3584.jpg");
        userMap.put("coverImage", user.getCoverImage() != null ? user.getCoverImage() : "https://i.pinimg.com/1200x/45/c0/86/45c08695ac7400476965367aababdd3b.jpg");
        userMap.put("bio", user.getBio() != null ? user.getBio() : "");
        return userMap;
    }
}