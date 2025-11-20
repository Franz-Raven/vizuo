package com.vizuo.backend.controller;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.UserRepository;
import com.vizuo.backend.service.UserService;
import com.vizuo.backend.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
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
    private final UserRepository userRepository;

    public ProfileController(UserService userService, CloudinaryService cloudinaryService, UserRepository userRepository) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            Map<String, Object> response = new HashMap<>();
            response.put("user", mapUserToResponse(user));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            User updatedUser = userService.updateUserProfile(currentUser.getId(), request);
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
            @RequestParam("type") String type,
            Authentication authentication) {
        try {
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }

            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

            String imageUrl = cloudinaryService.uploadImage(file, type);
            userService.updateUserImage(currentUser.getId(), type, imageUrl);

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