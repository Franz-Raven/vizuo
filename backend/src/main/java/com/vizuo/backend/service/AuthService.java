package com.vizuo.backend.service;

import com.vizuo.backend.dto.AuthResponse;
import com.vizuo.backend.dto.LoginRequest;
import com.vizuo.backend.dto.RegisterRequest;
import com.vizuo.backend.entity.Plan;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.UserSubscription;
import com.vizuo.backend.repository.PlanRepository;
import com.vizuo.backend.entity.Role;
import com.vizuo.backend.repository.RoleRepository;
import com.vizuo.backend.repository.UserRepository;
import com.vizuo.backend.repository.UserSubscriptionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final PlanRepository planRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, RoleRepository roleRepository, PlanRepository planRepository, UserSubscriptionRepository userSubscriptionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
        this.planRepository = planRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
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

        // Automatically assign Basic plan to new user
        Plan basicPlan = planRepository.findByName("Basic")
                .orElseThrow(() -> new RuntimeException("Basic plan not found"));
        
        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPlan(basicPlan);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setCurrentPeriodEnd(LocalDateTime.now().plusYears(100)); // Basic plan never expires
        subscription.setStatus("active");
        subscription.setPremiumDownloadsUsed(0);
        userSubscriptionRepository.save(subscription);

        String token = jwtService.generateToken(user);
        String role = mapUserRole(user);
        return new AuthResponse(token, user, role);
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
        String role = mapUserRole(user);
        return new AuthResponse(token, user, role);
    }

    private String mapUserRole(User user) {
    boolean isAdmin = user.getRoles().stream()
            .anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN"));
    if (isAdmin) return "admin";

    boolean isDesigner = user.getRoles().stream()
            .anyMatch(r -> r.getName().equalsIgnoreCase("DESIGNER"));
    if (isDesigner) return "designer";

    return "designer";
}
}
