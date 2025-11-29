package com.vizuo.backend.controller;

import com.vizuo.backend.dto.MoodboardCreateRequest;
import com.vizuo.backend.dto.MoodboardResponse;
import com.vizuo.backend.service.MoodboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moodboards")
@CrossOrigin(origins = "http://localhost:3000")
public class MoodboardController {

    @Autowired
    private MoodboardService moodboardService;

    @PostMapping("/create")
    public ResponseEntity<MoodboardResponse> createMoodboard(
            @RequestBody MoodboardCreateRequest req,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        MoodboardResponse res = moodboardService.createMoodboard(userId, req);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<MoodboardResponse>> getMoodboards(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        List<MoodboardResponse> res = moodboardService.getMoodboards(userId);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<MoodboardResponse> assignSavedImages(
            @PathVariable Long id,
            @RequestBody List<Long> savedImageIds,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        MoodboardResponse res = moodboardService.assignSavedImages(userId, id, savedImageIds);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}/saved-images/{savedImageId}")
    public ResponseEntity<MoodboardResponse> removeSavedImage(
            @PathVariable Long id,
            @PathVariable Long savedImageId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        MoodboardResponse res = moodboardService.removeSavedImage(userId, id, savedImageId);
        return ResponseEntity.ok(res);
    }
}
