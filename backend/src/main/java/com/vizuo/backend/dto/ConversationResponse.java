package com.vizuo.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ConversationResponse {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
    private LastMessageDTO lastMessage;
    private Long unreadCount;
    private List<ParticipantDTO> participants;

    public static class LastMessageDTO {
        private Long id;
        private String content;
        private Long senderId;
        private String senderUsername;
        private LocalDateTime sentAt;
        private Boolean isRead;

        public LastMessageDTO() {}
        public LastMessageDTO(Long id, String content, Long senderId, String senderUsername, LocalDateTime sentAt, Boolean isRead) {
            this.id = id;
            this.content = content;
            this.senderId = senderId;
            this.senderUsername = senderUsername;
            this.sentAt = sentAt;
            this.isRead = isRead;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }

        public String getSenderUsername() { return senderUsername; }
        public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

        public LocalDateTime getSentAt() { return sentAt; }
        public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

        public Boolean getIsRead() { return isRead; }
        public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    }

    public static class ParticipantDTO {
        private Long id;
        private String username;
        private String avatar;
        private Boolean isOnline;

        public ParticipantDTO() {}
        public ParticipantDTO(Long id, String username, String avatar) {
            this.id = id;
            this.username = username;
            this.avatar = avatar;
            this.isOnline = false;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public Boolean getIsOnline() { return isOnline; }
        public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }

    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public LastMessageDTO getLastMessage() { return lastMessage; }
    public void setLastMessage(LastMessageDTO lastMessage) { this.lastMessage = lastMessage; }

    public Long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(Long unreadCount) { this.unreadCount = unreadCount; }

    public List<ParticipantDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDTO> participants) { this.participants = participants; }

}