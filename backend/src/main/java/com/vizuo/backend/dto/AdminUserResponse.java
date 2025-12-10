package com.vizuo.backend.dto;

import com.vizuo.backend.entity.Role;
import com.vizuo.backend.entity.User;

import java.time.LocalDateTime;

public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private String avatar;
    private String role;
    private String status;
    private LocalDateTime createdAt;

    public AdminUserResponse() {}

    public AdminUserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.avatar = user.getAvatar();
        this.createdAt = user.getCreatedAt();
        this.status = user.getStatus() != null ? user.getStatus() : "ACTIVE";

        this.role = user.getRoles().stream()
                .map(Role::getName)
                .map(String::toLowerCase)
                .findFirst()
                .orElse("designer");
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
