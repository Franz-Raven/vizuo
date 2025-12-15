package com.vizuo.backend.security;

import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.JwtService;
import com.vizuo.backend.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CookieJwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CookieJwtAuthenticationFilter.class);

    public CookieJwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);

        logger.debug("Request to: {}", request.getRequestURI());
        logger.debug("Token extracted: {}", token != null ? "YES" : "NO");

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                String userIdStr = jwtService.extractUserId(token);
                Long userId = Long.parseLong(userIdStr);

                User user = userService.getUserByIdWithRoles(userId);
                logger.debug("User found in database");

                List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                        .map(r -> r.getName() == null ? "" : r.getName().trim().toUpperCase())
                        .filter(name -> !name.isEmpty())
                        .map(name -> new SimpleGrantedAuthority("ROLE_" + name))
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userIdStr,
                                null,
                                authorities
                        );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                logger.error("Failed to authenticate user from token", e);
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("authToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
