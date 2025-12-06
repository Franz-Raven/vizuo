package com.vizuo.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class MoodboardResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean isPrivate;
    private LocalDateTime createdAt;
    private List<Long> savedImageIds;
    private Long userId;
    private String username;
    private Long saveCount;
    private Boolean isSaved;
    private List<String> previewImages;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Long> getSavedImageIds() { return savedImageIds; }
    public void setSavedImageIds(List<Long> savedImageIds) { this.savedImageIds = savedImageIds; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getSaveCount() { return saveCount; }
    public void setSaveCount(Long saveCount) { this.saveCount = saveCount; }

    public Boolean getIsSaved() { return isSaved; }
    public void setIsSaved(Boolean isSaved) { this.isSaved = isSaved; }

    public List<String> getPreviewImages() { return previewImages; }
    public void setPreviewImages(List<String> previewImages) { this.previewImages = previewImages; }
}
