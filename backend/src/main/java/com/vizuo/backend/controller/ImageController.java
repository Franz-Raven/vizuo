package com.vizuo.backend.controller;

import com.vizuo.backend.dto.FeedResponse;
import com.vizuo.backend.dto.ImageResponse;
import com.vizuo.backend.dto.UploadResponse;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.ImageService;
import com.vizuo.backend.service.SearchService;
import com.vizuo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;

    @Autowired
    private SearchService searchService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(Authentication authentication,
            @RequestParam(value = "fileName", required = false) String fileName,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "keywords", required = false) String keywords,
            @RequestParam(value = "previewFiles", required = false) MultipartFile[] previewFiles,
            @RequestParam(value = "attachmentFiles", required = false) MultipartFile[] attachmentFiles,
            @RequestParam(value = "isPremium", required = false) Boolean isPremium) {

        try {
            Long userId = Long.parseLong(authentication.getName());
            User user = userService.getUserById(userId);
            String email = user.getEmail();

            List<String> keywordList = keywords != null && !keywords.isEmpty()
                    ? Arrays.asList(keywords.split(","))
                    : List.of();

            List<MultipartFile> previewFileList = previewFiles != null ? Arrays.asList(previewFiles) : List.of();
            List<MultipartFile> attachmentFileList = attachmentFiles != null ? Arrays.asList(attachmentFiles)
                    : List.of();

            UploadResponse response = imageService.uploadImage(
                    email,
                    fileName,
                    description,
                    keywordList,
                    previewFileList,
                    attachmentFileList,
                    isPremium);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/my-images")
    public ResponseEntity<?> getMyImages(Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            User user = userService.getUserById(userId);
            String email = user.getEmail();

            List<ImageResponse> images = imageService.getUserImages(email);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get images: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getImageById(@PathVariable Long id) {
        try {
            ImageResponse image = imageService.getImageById(id);
            return ResponseEntity.ok(image);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Image not found: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id, Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            User user = userService.getUserById(userId);
            String email = user.getEmail();

            imageService.deleteImage(id, email);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeedImages(Authentication authentication,
            @RequestParam(value = "limit", required = false, defaultValue = "15") int limit,
            @RequestParam(value = "cursor", required = false) String cursor) {
        try {
            Long currentUserId = null;
            if (authentication != null) {
                currentUserId = Long.parseLong(authentication.getName());
            }

            FeedResponse<ImageResponse> response = imageService.getPersonalizedFeed(currentUserId, limit, cursor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get feed images: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(Authentication authentication,
                                   @RequestParam(value = "q") String q,
                                   @RequestParam(value = "limit", required = false, defaultValue = "15") int limit,
                                   @RequestParam(value = "cursor", required = false) String cursor) {
        try {
            Long currentUserId = null;
            if (authentication != null) {
                currentUserId = Long.parseLong(authentication.getName());
            }
            FeedResponse<ImageResponse> result = searchService.searchFeed(currentUserId, q, limit, cursor);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Search failed: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeImage(@PathVariable Long id, Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = userService.getUserById(userId);
        String email = user.getEmail();
        return ResponseEntity.ok(imageService.likeImage(id, email));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<?> unlikeImage(@PathVariable Long id, Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = userService.getUserById(userId);
        String email = user.getEmail();
        return ResponseEntity.ok(imageService.unlikeImage(id, email));
    }

}
