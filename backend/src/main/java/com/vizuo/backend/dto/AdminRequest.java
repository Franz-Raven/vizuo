package com.vizuo.backend.dto;

public class AdminRequest {
    private String role;
    private String status;

    public AdminRequest() {}

    public AdminRequest(String role, String status) {
        this.role = role;
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
