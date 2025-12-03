package com.vizuo.backend.service;

import com.vizuo.backend.dto.ConversationResponse;
import com.vizuo.backend.dto.MessageResponse;
import com.vizuo.backend.entity.Conversation;
import com.vizuo.backend.entity.Message;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.ConversationRepository;
import com.vizuo.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Conversation getOrCreateConversation(Long user1Id, Long user2Id) {
        User user1 = userService.getUserById(user1Id);
        User user2 = userService.getUserById(user2Id);

        Optional<Conversation> existing = conversationRepository
                .findConversationBetweenUsers(user1, user2);

        if (existing.isPresent()) {
            return existing.get();
        }

        Conversation conversation = new Conversation();
        conversation.addParticipant(user1);
        conversation.addParticipant(user2);

        return conversationRepository.save(conversation);
    }

    @Transactional
    public Message sendMessage(Long conversationId, Long senderId, String content) {
        if (!conversationRepository.isUserParticipant(conversationId, senderId)) {
            throw new RuntimeException("Access denied: User is not a participant in this conversation");
        }
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found with id: " + conversationId));
        User sender = userService.getUserById(senderId);
        Message message = new Message(conversation, sender, content);
        conversation.setLastMessage(LocalDateTime.now());
        conversationRepository.save(conversation);

        return messageRepository.save(message);
    }

    public List<MessageResponse> getConversationMessages(Long conversationId, Long userId) {
        if (!conversationRepository.isUserParticipant(conversationId, userId)) {
            throw new RuntimeException("Access denied to conversation: " + conversationId);
        }
        List<Message> messages = messageRepository.findMessagesByConversationId(conversationId);
        return messages.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ConversationResponse> getUserConversations(Long userId) {
        List<Conversation> conversations = conversationRepository.findConversationsByUserId(userId);

        return conversations.stream()
                .map(conversation -> mapToConversationResponse(conversation, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public void markConversationAsRead(Long conversationId, Long userId) {
        messageRepository.markMessagesAsRead(conversationId, userId);
    }

    private ConversationResponse mapToConversationResponse(Conversation conversation, Long currentUserId) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setCreatedAt(conversation.getCreatedAt());
        response.setLastMessageAt(conversation.getLastMessage());

        Optional<Message> lastMessageOpt = messageRepository
                .findLastMessageByConversationId(conversation.getId());

        if (lastMessageOpt.isPresent()) {
            Message msg = lastMessageOpt.get();
            ConversationResponse.LastMessageDTO lastMessageDto = 
                new ConversationResponse.LastMessageDTO();
            lastMessageDto.setId(msg.getId());
            lastMessageDto.setContent(msg.getContent());
            lastMessageDto.setSenderId(msg.getSender().getId());
            lastMessageDto.setSenderUsername(msg.getSender().getUsername());
            lastMessageDto.setSentAt(msg.getSentAt());
            lastMessageDto.setIsRead(msg.getIsRead());
            response.setLastMessage(lastMessageDto);
        }

        Long unreadCount = messageRepository
                .countUnreadMessagesInConversation(conversation.getId(), currentUserId);
        response.setUnreadCount(unreadCount);

        // Map participants
        List<ConversationResponse.ParticipantDTO> participantDTOs = 
            conversation.getParticipants().stream()
                .map(user -> {
                    ConversationResponse.ParticipantDTO dto = 
                        new ConversationResponse.ParticipantDTO();
                    dto.setId(user.getId());
                    dto.setUsername(user.getUsername());
                    dto.setAvatar(user.getAvatar());
                    dto.setIsOnline(false); // default for now (no websocket yet)
                    return dto;
                })
                .collect(Collectors.toList());
        response.setParticipants(participantDTOs);

        return response;
    }

    private MessageResponse mapToResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setConversationId(message.getConversation().getId());
        response.setSenderId(message.getSender().getId());
        response.setSenderUsername(message.getSender().getUsername());
        response.setSenderAvatar(message.getSender().getAvatar());
        response.setContent(message.getContent());
        response.setSentAt(message.getSentAt());
        response.setIsRead(message.getIsRead());
        return response;
    }

    public Long getTotalUnreadCount(Long userId) {
        List<Conversation> conversations = conversationRepository.findConversationsByUserId(userId);
        return conversations.stream()
            .mapToLong(conv -> messageRepository.countUnreadMessagesInConversation(conv.getId(), userId))
            .sum();
    }
}