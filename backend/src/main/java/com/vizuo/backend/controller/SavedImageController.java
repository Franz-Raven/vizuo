package com.vizuo.backend.controller;

import com.vizuo.backend.dto.SavedImageResponse;
import com.vizuo.backend.service.SavedImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/saved-images")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SavedImageController {

    @Autowired
    private SavedImageService savedImageService;

    @PostMapping("/{imageId}")
    public ResponseEntity<SavedImageResponse> saveImage(
            @PathVariable Long imageId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        SavedImageResponse res = savedImageService.saveImage(userId, imageId);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> unsaveImage(
            @PathVariable Long imageId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        savedImageService.unsaveImage(userId, imageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SavedImageResponse>> getSavedImages(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        List<SavedImageResponse> res = savedImageService.getSavedImages(userId);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/by-ids")
    public ResponseEntity<List<SavedImageResponse>> getSavedImagesByIds(
            @RequestParam List<Long> ids,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        List<SavedImageResponse> res = savedImageService.getSavedImagesByIds(userId, ids);
        return ResponseEntity.ok(res);
    }

     @GetMapping("/space")
    public ResponseEntity<List<SavedImageResponse>> getSpaceImages(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        List<SavedImageResponse> res = savedImageService.getSpaceImages(userId);
        return ResponseEntity.ok(res);
    }
    
    // saved images not in space
    @GetMapping("/space/available")
    public ResponseEntity<List<SavedImageResponse>> getAvailableForSpace(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        List<SavedImageResponse> res = savedImageService.getAvailableForSpace(userId);
        return ResponseEntity.ok(res);
    }
    
    @PostMapping("/space/add/{savedImageId}")
    public ResponseEntity<Map<String, String>> addToSpace(
            @PathVariable Long savedImageId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        savedImageService.addToSpace(userId, savedImageId);
        return ResponseEntity.ok(Map.of("message", "Added to space"));
    }
    
    @PostMapping("/space/remove/{savedImageId}")
    public ResponseEntity<Map<String, String>> removeFromSpace(
            @PathVariable Long savedImageId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        savedImageService.removeFromSpace(userId, savedImageId);
        return ResponseEntity.ok(Map.of("message", "Removed from space"));
    }
}
