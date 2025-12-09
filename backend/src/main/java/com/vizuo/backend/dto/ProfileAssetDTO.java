package com.vizuo.backend.dto;

import java.io.Serializable;

public class ProfileAssetDTO implements Serializable {
    private Long id;
    private String imageUrl;
    private String title;
    private String type;
    private String createdAt;
    private Integer itemCount;
    private Integer likesCount;
    private Integer downloadsCount;
    private String likedAt;
    private String uploader;

    // builder class
    public static class Builder {
        private Long id;
        private String imageUrl;
        private String title;
        private String type;
        private String createdAt;
        private Integer itemCount;
        private Integer likesCount;
        private Integer downloadsCount;
        private String likedAt;
        private String uploader;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public Builder itemCount(Integer itemCount) { this.itemCount = itemCount; return this; }
        public Builder likesCount(Integer likesCount) { this.likesCount = likesCount; return this; }
        public Builder downloadsCount(Integer downloadsCount) { this.downloadsCount = downloadsCount; return this; }
        public Builder likedAt(String likedAt) { this.likedAt = likedAt; return this; }
        public Builder uploader(String uploader) { this.uploader = uploader; return this; }

        public ProfileAssetDTO build() {
            return new ProfileAssetDTO(this);
        }
    }

    private ProfileAssetDTO(Builder builder) {
        this.id = builder.id;
        this.imageUrl = builder.imageUrl;
        this.title = builder.title;
        this.type = builder.type;
        this.createdAt = builder.createdAt;
        this.itemCount = builder.itemCount;
        this.likesCount = builder.likesCount;
        this.downloadsCount = builder.downloadsCount;
        this.likedAt = builder.likedAt;
        this.uploader = builder.uploader;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }

    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public Integer getDownloadsCount() { return downloadsCount; }
    public void setDownloadsCount(Integer downloadsCount) { this.downloadsCount = downloadsCount; }

    public String getLikedAt() { return likedAt; }
    public void setLikedAt(String likedAt) { this.likedAt = likedAt; }

    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }

}