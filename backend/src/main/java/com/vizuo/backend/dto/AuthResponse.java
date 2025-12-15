package com.vizuo.backend.dto;

public class AuthResponse {
    private String token;
    private UserResponse user;
    private String role;

    public AuthResponse(String token, UserResponse user, String role) {
        this.token = token;
        this.user = user;
        this.role = role;
    }

    public String getToken() { return token; }
    public UserResponse getUser() { return user; }
    public String getRole() { return role; }
}
