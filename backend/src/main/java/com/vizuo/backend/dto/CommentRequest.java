// src/main/java/com/vizuo/backend/dto/CommentRequest.java
package com.vizuo.backend.dto;

public class CommentRequest {

    private String content;
    private Long parentCommentId;

    public CommentRequest() {
    }

    public CommentRequest(String content, Long parentCommentId) {
        this.content = content;
        this.parentCommentId = parentCommentId;
    }

    public String getContent() {
        return content;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }
}
