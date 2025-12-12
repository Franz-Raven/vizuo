package com.vizuo.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ImageResponse {
    private Long id;
    private String fileName;
    private String description;
    private List<String> keywords;
    private String thumbnailUrl;
    private List<AttachmentInfo> attachments;
    private boolean isPremium;
    private LocalDateTime createdAt;
    private long likesCount;
    private String uploaderUsername;
    private String uploaderAvatar;
    private boolean likedByCurrentUser;

    public ImageResponse() {}

    public ImageResponse(
            Long id,
            String fileName,
            String description,
            List<String> keywords,
            String thumbnailUrl,
            List<AttachmentInfo> attachments,
            boolean isPremium,
            LocalDateTime createdAt,
            long likesCount,
            String uploaderUsername,
            String uploaderAvatar
    ) {
        this.id = id;
        this.fileName = fileName;
        this.description = description;
        this.keywords = keywords;
        this.thumbnailUrl = thumbnailUrl;
        this.attachments = attachments;
        this.isPremium = isPremium;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.uploaderUsername = uploaderUsername;
        this.uploaderAvatar = uploaderAvatar;
        this.likedByCurrentUser = false;
    }

    public ImageResponse(
            Long id,
            String fileName,
            String description,
            List<String> keywords,
            String thumbnailUrl,
            List<AttachmentInfo> attachments,
            boolean isPremium,
            LocalDateTime createdAt,
            long likesCount,
            String uploaderUsername,
            String uploaderAvatar,
            boolean likedByCurrentUser
    ) {
        this.id = id;
        this.fileName = fileName;
        this.description = description;
        this.keywords = keywords;
        this.thumbnailUrl = thumbnailUrl;
        this.attachments = attachments;
        this.isPremium = isPremium;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.uploaderUsername = uploaderUsername;
        this.uploaderAvatar = uploaderAvatar;
        this.likedByCurrentUser = likedByCurrentUser;
    }

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

    public boolean isPremium() { return isPremium; }
    public void setPremium(boolean premium) { isPremium = premium; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getLikesCount() { return likesCount; }
    public void setLikesCount(long likesCount) { this.likesCount = likesCount; }

    public String getUploaderUsername() { return uploaderUsername; }
    public void setUploaderUsername(String uploaderUsername) { this.uploaderUsername = uploaderUsername; }

    public String getUploaderAvatar() { return uploaderAvatar; }
    public void setUploaderAvatar(String uploaderAvatar) { this.uploaderAvatar = uploaderAvatar; }

    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }
}
