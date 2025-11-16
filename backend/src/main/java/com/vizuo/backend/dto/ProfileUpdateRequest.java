package com.vizuo.backend.dto;

import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {
    @Size(min = 1, max = 50, message = "Username must be between 1 and 50 characters")
    private String username;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    private String avatar;
    private String coverImage;

    // getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
}