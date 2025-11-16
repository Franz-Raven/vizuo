package com.vizuo.backend.controller;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.UserService;
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

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User user = userService.getUserById(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("user", mapUserToResponse(user));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ProfileUpdateRequest request) {
        try {
            Long userId = extractUserIdFromToken(token);
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
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
            }

            if (file.getSize() > 5 * 1024 * 1024) { // 5MB
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }

            String fileUrl = userService.uploadImage(file, type);

            return ResponseEntity.ok(Map.of("url", fileUrl, "message", "File uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("avatar", user.getAvatar() != null ? user.getAvatar() : "https://i.pravatar.cc/150?img=12");
        userMap.put("coverImage", user.getCoverImage() != null ? user.getCoverImage() : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop");
        userMap.put("bio", user.getBio() != null ? user.getBio() : "");
        return userMap;
    }

    private Long extractUserIdFromToken(String token) {
        // Extract user ID from JWT token
        return 1L; // Mock user ID
    }
}