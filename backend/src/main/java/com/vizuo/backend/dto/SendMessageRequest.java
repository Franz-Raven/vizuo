package com.vizuo.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {
    @NotBlank(message = "Message content cannot be empty")
    private String content;
    
    private Long attachmentId;
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Long getAttachmentId() { return attachmentId; }
    public void setAttachmentId(Long attachmentId) { this.attachmentId = attachmentId; }
}