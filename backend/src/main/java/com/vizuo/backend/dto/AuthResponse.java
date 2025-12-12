package com.vizuo.backend.dto;

import com.vizuo.backend.entity.User;

public class AuthResponse {
    private String token;
    private User user;
    private String role;

    public AuthResponse(String token, User user, String role) {
        this.token = token;
        this.user = user;
        this.role = role;
    }

    public String getToken() { return token; }
    public User getUser() { return user; }
    public String getRole() { return role; }
}
