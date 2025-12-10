package com.vizuo.backend.controller;

import com.vizuo.backend.dto.AdminRequest;
import com.vizuo.backend.dto.AdminUserResponse;
import com.vizuo.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAllRoles() {
        return ResponseEntity.ok(adminService.getAllRoles());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<AdminUserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody AdminRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole()));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestBody AdminRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getStatus()));
    }
}
