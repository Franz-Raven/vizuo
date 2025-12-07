// src/main/java/com/vizuo/backend/dto/CommentResponse.java
package com.vizuo.backend.dto;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;
    private String userAvatar;
    private Long parentCommentId;

    public CommentResponse() {
    }

    public CommentResponse(Long id, String content, LocalDateTime createdAt, Long userId, String username, String userAvatar, Long parentCommentId) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.userId = userId;
        this.username = username;
        this.userAvatar = userAvatar;
        this.parentCommentId = parentCommentId;
    }

    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getUserAvatar() {
        return userAvatar;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setUserAvatar(String userAvatar) {
        this.userAvatar = userAvatar;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }
}
