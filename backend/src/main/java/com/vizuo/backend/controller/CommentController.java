// src/main/java/com/vizuo/backend/controller/CommentController.java
package com.vizuo.backend.controller;

import com.vizuo.backend.dto.CommentRequest;
import com.vizuo.backend.dto.CommentResponse;
import com.vizuo.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/image/{imageId}")
    public ResponseEntity<?> getCommentsForImage(@PathVariable Long imageId) {
        try {
            List<CommentResponse> comments = commentService.getCommentsForImage(imageId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get comments: " + e.getMessage());
        }
    }

    @PostMapping("/image/{imageId}")
    public ResponseEntity<?> addComment(
            @PathVariable Long imageId,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            CommentResponse response = commentService.addComment(imageId, userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add comment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getName());
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }
    }
}
