package com.vizuo.backend.controller;

import com.vizuo.backend.dto.AuthResponse;
import com.vizuo.backend.dto.LoginRequest;
import com.vizuo.backend.dto.RegisterRequest;
import com.vizuo.backend.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.registerUser(request);

            ResponseCookie cookie = ResponseCookie.from("authToken", response.getToken())
                    .httpOnly(true)
                    .secure(false) // set to true in production (https)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .build();

            ResponseCookie roleCookie = ResponseCookie.from("userRole", response.getRole())
                    .httpOnly(false) // must be readable by Next middleware
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .build();
                    
            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .header(HttpHeaders.SET_COOKIE, roleCookie.toString())
                    .body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {   
            AuthResponse response = authService.authenticate(request);

            ResponseCookie cookie = ResponseCookie.from("authToken", response.getToken())
                    .httpOnly(true)
                    .secure(false) // set to true in production (https)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .build();   

            ResponseCookie roleCookie = ResponseCookie.from("userRole", response.getRole())
                    .httpOnly(false) // must be readable by Next middleware
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .build();

            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .header(HttpHeaders.SET_COOKIE, roleCookie.toString())
                    .body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie roleCookie = ResponseCookie.from("userRole", "")
                .httpOnly(false)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, roleCookie.toString())
                .body(Map.of("message", "Logged out"));
    }
}
