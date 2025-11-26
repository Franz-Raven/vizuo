package com.vizuo.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ImageResponse {
    private Long id;
    private String fileName;
    private String description;
    private List<String> keywords;
    private String thumbnailUrl;
    private List<String> attachmentUrls;
    private LocalDateTime createdAt;
    private long likesCount;

    public ImageResponse() {}

    public ImageResponse(
            Long id,
            String fileName,
            String description,
            List<String> keywords,
            String thumbnailUrl,
            List<String> attachmentUrls,
            LocalDateTime createdAt,
            long likesCount
    ) {
        this.id = id;
        this.fileName = fileName;
        this.description = description;
        this.keywords = keywords;
        this.thumbnailUrl = thumbnailUrl;
        this.attachmentUrls = attachmentUrls;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
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

    public List<String> getAttachmentUrls() { return attachmentUrls; }
    public void setAttachmentUrls(List<String> attachmentUrls) { this.attachmentUrls = attachmentUrls; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getLikesCount() { return likesCount; }
    public void setLikesCount(long likesCount) { this.likesCount = likesCount; }
}
