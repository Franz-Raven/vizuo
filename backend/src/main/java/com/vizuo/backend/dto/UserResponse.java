package com.vizuo.backend.dto;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String avatar;
    private String bio;
    private String coverImage;
    private String role;
    private String status;

    public UserResponse(Long id, String username, String email, String avatar, String bio, String coverImage, String role, String status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.bio = bio;
        this.coverImage = coverImage;
        this.role = role;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getAvatar() { return avatar; }
    public String getBio() { return bio; }
    public String getCoverImage() { return coverImage; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
}
