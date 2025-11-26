package com.vizuo.backend.service;

import com.vizuo.backend.dto.ConversationResponse;
import com.vizuo.backend.dto.MessageResponse;
import com.vizuo.backend.entity.Conversation;
import com.vizuo.backend.entity.Message;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.ConversationRepository;
import com.vizuo.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository,
                          ConversationRepository conversationRepository,
                          UserService userService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userService = userService;
    }

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        Conversation conversation = findOrCreateConversation(senderId, receiverId);
        User sender = userService.getUserById(senderId);

        Message message = new Message(conversation, sender, content);
        Message savedMessage = messageRepository.save(message);

        conversation.setLastMessage(savedMessage.getSentAt());
        conversationRepository.save(conversation);

        return savedMessage;
    }

    private Conversation findOrCreateConversation(Long user1Id, Long user2Id) {
        List<Long> userIds = List.of(user1Id, user2Id);
        Optional<Conversation> existingConversation = conversationRepository
                .findConversationByUserIds(userIds, 2L);

        if (existingConversation.isPresent()) {
            return existingConversation.get();
        }

        Conversation conversation = new Conversation();
        User user1 = userService.getUserById(user1Id);
        User user2 = userService.getUserById(user2Id);

        conversation.addParticipant(user1);
        conversation.addParticipant(user2);

        return conversationRepository.save(conversation);
    }

    public List<MessageResponse> getConversationMessages(Long conversationId, Long currentUserId) {
        if (!conversationRepository.isUserInConversation(conversationId, currentUserId)) {
            throw new SecurityException("User not authorized to access this conversation");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderBySentAtAsc(conversationId);
        return messages.stream().map(this::mapToMessageResponse).collect(Collectors.toList());
    }

    public List<ConversationResponse> getUserConversations(Long userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);
        return conversations.stream()
                .map(conv -> mapToConversationResponse(conv, userId))
                .collect(Collectors.toList());
    }

    public Long getUnreadCount(Long userId) {
        List<Conversation> conversations = conversationRepository.findByUserId(userId);
        return conversations.stream()
                .mapToLong(conv -> messageRepository.countByConversationIdAndIsReadFalseAndSenderIdNot(conv.getId(), userId))
                .sum();
    }

    public void markConversationAsRead(Long conversationId, Long userId) {
        if (!conversationRepository.isUserInConversation(conversationId, userId)) {
            throw new SecurityException("User not authorized to access this conversation");
        }

        List<Message> unreadMessages = messageRepository.findUnreadMessages(conversationId, userId);
        unreadMessages.forEach(m -> m.setIsRead(true));
        messageRepository.saveAll(unreadMessages);
    }

    public Optional<Conversation> getConversationBetweenUsers(Long user1Id, Long user2Id) {
        List<Long> userIds = List.of(user1Id, user2Id);
        return conversationRepository.findConversationByUserIds(userIds, 2L);
    }

    public boolean isUserInConversation(Long conversationId, Long userId) {
        return conversationRepository.isUserInConversation(conversationId, userId);
    }

    private MessageResponse mapToMessageResponse(Message message) {
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

    private ConversationResponse mapToConversationResponse(Conversation conversation, Long currentUserId) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setCreatedAt(conversation.getCreatedAt());
        response.setLastMessageAt(conversation.getLastMessage());

        List<User> otherParticipants = conversation.getParticipants().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .collect(Collectors.toList());
        response.setParticipants(otherParticipants);

        Optional<Message> lastMessage = conversation.getMessages().stream()
                .max((m1, m2) -> m1.getSentAt().compareTo(m2.getSentAt()));

        if (lastMessage.isPresent()) {
            Message message = lastMessage.get();
            response.setLastMessageContent(message.getContent());
            response.setLastMessageSenderId(message.getSender().getId());
            response.setLastMessageSentAt(message.getSentAt());
        }

        Long unreadCount = messageRepository.countByConversationIdAndIsReadFalseAndSenderIdNot(
                conversation.getId(), currentUserId);
        response.setUnreadCount(unreadCount);

        return response;
    }
}