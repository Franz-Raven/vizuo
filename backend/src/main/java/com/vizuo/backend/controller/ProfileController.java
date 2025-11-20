package com.vizuo.backend.controller;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.CloudinaryService;
import com.vizuo.backend.service.JwtService;
import com.vizuo.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    private final JwtService jwtService;

    public ProfileController(
            UserService userService,
            CloudinaryService cloudinaryService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(
            @CookieValue(name = "authToken", required = false) String token
    ) {
        try {
            Long userId = resolveUserId(token);
            User user = userService.getUserById(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("user", mapUserToResponse(user));

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @CookieValue(name = "authToken", required = false) String token,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        try {
            Long userId = resolveUserId(token);
            User updatedUser = userService.updateUserProfile(userId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("user", mapUserToResponse(updatedUser));
            response.put("message", "Profile updated successfully");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @CookieValue(name = "authToken", required = false) String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type
    ) {
        try {
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File size must be less than 5MB"));
            }

            Long userId = resolveUserId(token);
            String imageUrl = cloudinaryService.uploadImage(file, type);
            userService.updateUserImage(userId, type, imageUrl);

            return ResponseEntity.ok(Map.of(
                    "url", imageUrl,
                    "message", "Image uploaded successfully to Cloudinary"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Long resolveUserId(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Missing or invalid authToken cookie");
        }

        String userIdStr = jwtService.extractUserId(token);
        try {
            return Long.parseLong(userIdStr);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Invalid user id in token");
        }
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("avatar",
                user.getAvatar() != null
                        ? user.getAvatar()
                        : "https://i.pinimg.com/736x/9f/4c/f0/9f4cf0f24b376077a2fcdab2e85c3584.jpg");
        userMap.put("coverImage",
                user.getCoverImage() != null
                        ? user.getCoverImage()
                        : "https://i.pinimg.com/1200x/45/c0/86/45c08695ac7400476965367aababdd3b.jpg");
        userMap.put("bio", user.getBio() != null ? user.getBio() : "");
        return userMap;
    }
}
