// src/main/java/com/vizuo/backend/service/CommentService.java
package com.vizuo.backend.service;

import com.vizuo.backend.dto.CommentRequest;
import com.vizuo.backend.dto.CommentResponse;
import com.vizuo.backend.entity.Comment;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.CommentRepository;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommentResponse> getCommentsForImage(Long imageId) {
        List<Comment> comments = commentRepository.findByImageIdOrderByCreatedAtAsc(imageId);
        return comments.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CommentResponse addComment(Long imageId, Long userId, CommentRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Content must not be empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            if (!parentComment.getImage().getId().equals(imageId)) {
                throw new RuntimeException("Parent comment does not belong to this image");
            }
        }

        Comment comment = new Comment(user, image, request.getContent().trim(), parentComment);
        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        Long parentId = null;
        if (comment.getParentComment() != null) {
            parentId = comment.getParentComment().getId();
        }

        User user = comment.getUser();

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                user != null ? user.getId() : null,
                user != null ? user.getUsername() : null,
                user != null ? user.getAvatar() : null,
                parentId
        );
    }
}
