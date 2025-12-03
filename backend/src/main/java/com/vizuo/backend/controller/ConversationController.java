package com.vizuo.backend.controller;

import com.vizuo.backend.dto.ConversationResponse;
import com.vizuo.backend.dto.MessageResponse;
import com.vizuo.backend.dto.SendMessageRequest;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.service.MessageService;
import com.vizuo.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "http://localhost:3000")
public class ConversationController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getUserConversations(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        List<ConversationResponse> conversations = messageService.getUserConversations(userId);
        return ResponseEntity.ok(Map.of("conversations", conversations));
    }

    @PostMapping("/with/{otherUserId}")
    public ResponseEntity<?> getOrCreateConversation(
            @PathVariable Long otherUserId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        
        if (userId.equals(otherUserId)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Cannot create conversation with yourself"));
        }
        
        com.vizuo.backend.entity.Conversation conversation = 
            messageService.getOrCreateConversation(userId, otherUserId);
        
        return ResponseEntity.ok(Map.of(
            "conversationId", conversation.getId(),
            "message", "Conversation ready"
        ));
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<?> getConversationMessages(
            @PathVariable Long conversationId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        List<MessageResponse> messages = messageService.getConversationMessages(conversationId, userId);
        return ResponseEntity.ok(Map.of("messages", messages));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long conversationId,
            @Valid @RequestBody SendMessageRequest request,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        com.vizuo.backend.entity.Message message = 
            messageService.sendMessage(conversationId, userId, request.getContent());
        
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setConversationId(message.getConversation().getId());
        response.setSenderId(message.getSender().getId());
        response.setSenderUsername(message.getSender().getUsername());
        response.setSenderAvatar(message.getSender().getAvatar());
        response.setContent(message.getContent());
        response.setSentAt(message.getSentAt());
        response.setIsRead(message.getIsRead());
        
        return ResponseEntity.ok(Map.of(
            "message", response,
            "status", "Message sent successfully"
        ));
    }

    @PostMapping("/{conversationId}/mark-read")
    public ResponseEntity<?> markConversationAsRead(
            @PathVariable Long conversationId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        messageService.markConversationAsRead(conversationId, userId);
        return ResponseEntity.ok(Map.of("message", "Conversation marked as read"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getTotalUnreadCount(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        
        Long totalUnread = messageService.getTotalUnreadCount(userId);
            
        return ResponseEntity.ok(Map.of("unreadCount", totalUnread));
    }

    @GetMapping("/search-users")
    public ResponseEntity<?> searchUsers(
            @RequestParam String query,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        List<User> users = userService.searchUsers(query, userId);
        return ResponseEntity.ok(Map.of("users", users));
    }
}