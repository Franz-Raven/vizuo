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

    @GetMapping("/public")
    public ResponseEntity<List<MoodboardResponse>> getPublicMoodboards(
            @RequestParam(required = false) String search,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        List<MoodboardResponse> res = moodboardService.getPublicMoodboards(userId, search);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/saved")
    public ResponseEntity<List<MoodboardResponse>> getSavedMoodboards(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        List<MoodboardResponse> res = moodboardService.getSavedMoodboards(userId);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Void> saveMoodboard(
            @PathVariable Long id,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        moodboardService.saveMoodboard(userId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> unsaveMoodboard(
            @PathVariable Long id,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        moodboardService.unsaveMoodboard(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MoodboardResponse> getMoodboardById(
            @PathVariable Long id,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        MoodboardResponse res = moodboardService.getMoodboardById(userId, id);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MoodboardResponse> updateMoodboard(
            @PathVariable Long id,
            @RequestBody MoodboardCreateRequest req,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        MoodboardResponse res = moodboardService.updateMoodboard(userId, id, req);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMoodboard(
            @PathVariable Long id,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        moodboardService.deleteMoodboard(userId, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reorder")
    public ResponseEntity<MoodboardResponse> reorderImages(
            @PathVariable Long id,
            @RequestBody List<Long> savedImageIds,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        MoodboardResponse res = moodboardService.reorderImages(userId, id, savedImageIds);
        return ResponseEntity.ok(res);
    }
}
