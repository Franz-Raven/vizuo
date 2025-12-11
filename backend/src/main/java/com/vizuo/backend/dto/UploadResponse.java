package com.vizuo.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UploadResponse {

    private Long id;
    private String fileName;
    private String description;
    private List<String> keywords;
    private String thumbnailUrl;
    private List<AttachmentInfo> attachments;
    private Boolean isPremium;
    private LocalDateTime createdAt;

    private String uploaderUsername;
    private String uploaderAvatar;

    private boolean success;
    private String message;

    public UploadResponse() {}

    public UploadResponse(
            Long id,
            String fileName,
            String description,
            List<String> keywords,
            String thumbnailUrl,
            List<AttachmentInfo> attachments,
            Boolean isPremium,
            LocalDateTime createdAt,
            String uploaderUsername,
            String uploaderAvatar,
            boolean success,
            String message
    ) {
        this.id = id;
        this.fileName = fileName;
        this.description = description;
        this.keywords = keywords;
        this.thumbnailUrl = thumbnailUrl;
        this.attachments = attachments;
        this.isPremium = isPremium;
        this.createdAt = createdAt;
        this.uploaderUsername = uploaderUsername;
        this.uploaderAvatar = uploaderAvatar;
        this.success = success;
        this.message = message;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public List<AttachmentInfo> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentInfo> attachments) { this.attachments = attachments; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUploaderUsername() { return uploaderUsername; }
    public void setUploaderUsername(String uploaderUsername) { this.uploaderUsername = uploaderUsername; }

    public String getUploaderAvatar() { return uploaderAvatar; }
    public void setUploaderAvatar(String uploaderAvatar) { this.uploaderAvatar = uploaderAvatar; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
