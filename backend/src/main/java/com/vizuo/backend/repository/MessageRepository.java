package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Conversation;
import com.vizuo.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // by timestamp
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.sentAt ASC")
    List<Message> findMessagesByConversationId(@Param("conversationId") Long conversationId);

    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.sentAt DESC LIMIT 1")
    Optional<Message> findLastMessageByConversationId(@Param("conversationId") Long conversationId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND m.isRead = false")
    Long countUnreadMessagesInConversation(@Param("conversationId") Long conversationId, @Param("userId") Long userId);

    @Query("SELECT DISTINCT m.conversation FROM Message m WHERE m.conversation.id IN :conversationIds AND m.sender.id != :userId AND m.isRead = false")
    List<Conversation> findConversationsWithUnreadMessages(@Param("conversationIds") List<Long> conversationIds, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND m.isRead = false")
    void markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}