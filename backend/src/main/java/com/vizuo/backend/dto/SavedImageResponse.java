package com.vizuo.backend.dto;

import java.time.LocalDateTime;

public class SavedImageResponse {
    private Long id;
    private Long imageId;
    private String thumbnailUrl;
    private String title;
    private String creator;
    private LocalDateTime addedAt;
    private boolean isSpaceItem;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public boolean isSpaceItem() { return isSpaceItem; }
    public void setSpaceItem(boolean spaceItem) { isSpaceItem = spaceItem; }
}
