package com.vizuo.backend.controller;

import com.vizuo.backend.dto.ProfileUpdateRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.CloudinaryService;
import com.vizuo.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    public ProfileController(
            UserService userService,
            CloudinaryService cloudinaryService
    ) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        User user = userService.getUserById(userId);
        
        return ResponseEntity.ok(Map.of("user", mapUserToResponse(user)));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            Authentication auth,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        Long userId = Long.parseLong(auth.getName());
        User updatedUser = userService.updateUserProfile(userId, request);
        
        return ResponseEntity.ok(Map.of(
            "user", mapUserToResponse(updatedUser),
            "message", "Profile updated successfully"
        ));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            Authentication auth,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type
    ) {
        Long userId = Long.parseLong(auth.getName());
        
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must be less than 5MB"));
        }
        
        String imageUrl = cloudinaryService.uploadImage(file, type);
        userService.updateUserImage(userId, type, imageUrl);
        
        return ResponseEntity.ok(Map.of(
            "url", imageUrl,
            "message", "Image uploaded successfully"
        ));
    }

    @GetMapping("/assets")
    public ResponseEntity<?> getProfileAssets(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        
        var spaceItems = userService.getUserSpaceItems(userId);
        
        var uploads = userService.getUserUploads(userId);
        
        var favorites = userService.getUserFavorites(userId);
        
        return ResponseEntity.ok(Map.of(
            "spaceItems", spaceItems,
            "uploads", uploads,
            "favorites", favorites
        ));
    }

    private Map<String, Object> mapUserToResponse(User user) {
        return Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "avatar", user.getAvatar() != null 
                ? user.getAvatar() 
                : "https://i.pinimg.com/736x/9f/4c/f0/9f4cf0f24b376077a2fcdab2e85c3584.jpg",
            "coverImage", user.getCoverImage() != null 
                ? user.getCoverImage() 
                : "https://i.pinimg.com/1200x/45/c0/86/45c08695ac7400476965367aababdd3b.jpg",
            "bio", user.getBio() != null ? user.getBio() : "",
            "role", mapUserRole(user)
        );
    }

    private String mapUserRole(User user) {
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN"));

        if (isAdmin) return "admin";

        boolean isDesigner = user.getRoles().stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase("DESIGNER"));

        if (isDesigner) return "designer";

        return "designer";
    }
}