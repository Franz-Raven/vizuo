package com.vizuo.backend.controller;

import com.vizuo.backend.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class WebSocketMessagingController {

    private final MessageService messageService; 
    private final SimpMessagingTemplate messagingTemplate;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(WebSocketMessagingController.class);

    public WebSocketMessagingController(
            MessageService messageService, 
            SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{conversationId}")
    public void sendMessage(
            @DestinationVariable Long conversationId,
            @Payload MessageDTO messageDTO,
            Principal principal) {
        
        try {
            Long userId = Long.parseLong(principal.getName());
            logger.debug("Received WebSocket message from user {} for conversation {}", userId, conversationId);
            
            var savedMessage = messageService.sendMessage(
                    conversationId,
                    userId, 
                    messageDTO.getContent()
            );
            
            var conversations = messageService.getUserConversations(userId);
            var conversation = conversations.stream()
                    .filter(c -> c.getId().equals(conversationId))
                    .findFirst()
                    .orElse(null);
            
            if (conversation == null) {
                logger.error("Conversation not found: {}", conversationId);
                return;
            }
            
            Long otherUserId = conversation.getParticipants().stream()
                    .filter(p -> !p.getId().equals(userId))
                    .findFirst()
                    .map(p -> p.getId())
                    .orElse(null);
            
            // convert to DTO
            MessageResponseDTO response = new MessageResponseDTO(
                savedMessage.getId(),
                savedMessage.getConversation().getId(),
                savedMessage.getSender().getId(),
                savedMessage.getSender().getUsername(),
                savedMessage.getSender().getAvatar(),
                savedMessage.getContent(),
                savedMessage.getSentAt(),
                savedMessage.getIsRead()
            );
            
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/messages/" + conversationId,
                    response
            );
            
            if (otherUserId != null) {
                messagingTemplate.convertAndSendToUser(
                        otherUserId.toString(),
                        "/queue/messages/" + conversationId,
                        response
                );
                logger.debug("Message delivered to user {}", otherUserId);
            }
            
            logger.debug("Message sent successfully via WebSocket");
        } catch (Exception e) {
            logger.error("Error handling WebSocket message", e);
        }
    }

    @MessageMapping("/typing/{conversationId}")
    public void sendTypingIndicator(
            @DestinationVariable Long conversationId,
            @Payload Map<String, Object> payload,
            Principal principal) {
        
        try {
            Long userId = Long.parseLong(principal.getName());
            boolean isTyping = (boolean) payload.get("isTyping");
            
            // Get conversation to find other participant
            var conversations = messageService.getUserConversations(userId);
            var conversation = conversations.stream()
                    .filter(c -> c.getId().equals(conversationId))
                    .findFirst()
                    .orElse(null);
            
            if (conversation == null) return;
            
            Long otherUserId = conversation.getParticipants().stream()
                    .filter(p -> !p.getId().equals(userId))
                    .findFirst()
                    .map(p -> p.getId())
                    .orElse(null);
            
            if (otherUserId != null) {
                TypingIndicatorDTO typingIndicator = new TypingIndicatorDTO(isTyping, userId);
                messagingTemplate.convertAndSendToUser(
                        otherUserId.toString(),
                        "/queue/typing/" + conversationId,
                        typingIndicator
                );
            }
        } catch (Exception e) {
            logger.error("Error handling typing indicator", e);
        }
    }

    public static class MessageDTO {
        private String content;
        private Long attachmentId;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Long getAttachmentId() { return attachmentId; }
        public void setAttachmentId(Long attachmentId) { this.attachmentId = attachmentId; }
    }

    public static class MessageResponseDTO {
        private Long id;
        private Long conversationId;
        private Long senderId;
        private String senderUsername;
        private String senderAvatar;
        private String content;
        private LocalDateTime sentAt;
        private Boolean isRead;

        public MessageResponseDTO(Long id, Long conversationId, Long senderId,
                                 String senderUsername, String senderAvatar,
                                 String content, LocalDateTime sentAt, Boolean isRead) {
            this.id = id;
            this.conversationId = conversationId;
            this.senderId = senderId;
            this.senderUsername = senderUsername;
            this.senderAvatar = senderAvatar;
            this.content = content;
            this.sentAt = sentAt;
            this.isRead = isRead;
        }

        public Long getId() { return id; }
        public Long getConversationId() { return conversationId; }
        public Long getSenderId() { return senderId; }
        public String getSenderUsername() { return senderUsername; }
        public String getSenderAvatar() { return senderAvatar; }
        public String getContent() { return content; }
        public LocalDateTime getSentAt() { return sentAt; }
        public Boolean getIsRead() { return isRead; }
    }

    public static class TypingIndicatorDTO {
        private boolean isTyping;
        private Long userId;

        public TypingIndicatorDTO(boolean isTyping, Long userId) {
            this.isTyping = isTyping;
            this.userId = userId;
        }

        public boolean isTyping() { return isTyping; }
        public Long getUserId() { return userId; }
    }
}