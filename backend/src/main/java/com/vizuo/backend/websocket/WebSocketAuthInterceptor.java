package com.vizuo.backend.websocket;

import com.vizuo.backend.service.JwtService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(WebSocketAuthInterceptor.class);

    public WebSocketAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            logger.debug("WebSocket CONNECT attempt");

        List<String> cookies = accessor.getNativeHeader("cookie");
        logger.info("Cookies found: {}", cookies);
        String token = null;
        if (cookies != null && !cookies.isEmpty()) {
            String cookieHeader = cookies.get(0);
            logger.info("Cookie header: {}", cookieHeader);
            
            //parse cookies
            String[] cookiePairs = cookieHeader.split(";");
            for (String pair : cookiePairs) {
                String[] keyValue = pair.trim().split("=", 2);
                if (keyValue.length == 2 && "authToken".equals(keyValue[0])) {
                    token = keyValue[1];
                    logger.info("Found authToken: {}", token.substring(0, Math.min(20, token.length())) + "...");
                    break;
                }
            }
        }
            if (token != null) {
                try {
                    String userIdStr = jwtService.extractUserId(token);
                    Long userId = Long.parseLong(userIdStr);
                    
                    logger.debug("WebSocket authenticated user ID: {}", userId);
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userIdStr, 
                            null, 
                            Collections.emptyList()
                        );
                    
                    accessor.setUser(authentication);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    logger.error("Failed to authenticate WebSocket connection", e);
                    SecurityContextHolder.clearContext();
                }
            } else {
                logger.warn("No authToken cookie found in WebSocket connection");
            }
        }

        return message;
    }
}