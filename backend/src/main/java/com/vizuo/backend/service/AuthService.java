package com.vizuo.backend.service;

import com.vizuo.backend.dto.AuthResponse;
import com.vizuo.backend.dto.LoginRequest;
import com.vizuo.backend.dto.RegisterRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.Role;
import com.vizuo.backend.repository.RoleRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        String encoded = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getEmail(), request.getUsername(), encoded);
        Role designerRole = roleRepository.findByName("DESIGNER")
        .orElseThrow(() -> new RuntimeException("Default role not found"));

        user.getRoles().add(designerRole);
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    public AuthResponse authenticate(LoginRequest request) {
        User user;

        if (request.getIdentifier().contains("@")) {
            user = userRepository.findByEmail(request.getIdentifier())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        } else {
            user = userRepository.findByUsername(request.getIdentifier())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }
}
