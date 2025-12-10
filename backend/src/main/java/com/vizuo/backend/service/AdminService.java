package com.vizuo.backend.service;

import com.vizuo.backend.dto.AdminUserResponse;
import com.vizuo.backend.entity.Role;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.RoleRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserResponse::new)
                .toList();
    }

    public List<String> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(Role::getName)
                .map(String::toLowerCase)
                .toList();
    }

    public AdminUserResponse updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String normalized = role.toUpperCase();
        Role roleEntity = roleRepository.findByName(normalized)
                .orElseThrow(() -> new RuntimeException("Role not found: " + normalized));

        user.getRoles().clear();
        user.getRoles().add(roleEntity);

        User saved = userRepository.save(user);
        return new AdminUserResponse(saved);
    }

    public AdminUserResponse updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String normalized = status == null ? "" : status.toUpperCase();
        if (!normalized.equals("ACTIVE") && !normalized.equals("BANNED")) {
            throw new RuntimeException("Invalid status: " + status);
        }

        user.setStatus(normalized);
        User saved = userRepository.save(user);
        return new AdminUserResponse(saved);
    }
}
