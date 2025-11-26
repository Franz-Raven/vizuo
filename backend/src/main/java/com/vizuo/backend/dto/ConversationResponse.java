package com.vizuo.backend.dto;

import com.vizuo.backend.entity.User;
import java.time.LocalDateTime;
import java.util.List;

public class ConversationResponse {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private String lastMessageContent;
    private Long lastMessageSenderId;
    private LocalDateTime lastMessageSentAt;
    private Long unreadCount;
    private List<User> participants;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public String getLastMessageContent() { return lastMessageContent; }
    public void setLastMessageContent(String lastMessageContent) { this.lastMessageContent = lastMessageContent; }
    public Long getLastMessageSenderId() { return lastMessageSenderId; }
    public void setLastMessageSenderId(Long lastMessageSenderId) { this.lastMessageSenderId = lastMessageSenderId; }
    public LocalDateTime getLastMessageSentAt() { return lastMessageSentAt; }
    public void setLastMessageSentAt(LocalDateTime lastMessageSentAt) { this.lastMessageSentAt = lastMessageSentAt; }
    public Long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(Long unreadCount) { this.unreadCount = unreadCount; }
    public List<User> getParticipants() { return participants; }
    public void setParticipants(List<User> participants) { this.participants = participants; }
}