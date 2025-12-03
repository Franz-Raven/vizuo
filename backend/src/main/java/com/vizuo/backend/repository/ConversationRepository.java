package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Conversation;
import com.vizuo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT DISTINCT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId ORDER BY c.lastMessage DESC")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    // Find 1-on-1 conversation between two users
    @Query("SELECT c FROM Conversation c WHERE SIZE(c.participants) = 2 AND :user1 MEMBER OF c.participants AND :user2 MEMBER OF c.participants")
    Optional<Conversation> findConversationBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Conversation c JOIN c.participants p WHERE c.id = :conversationId AND p.id = :userId")
    boolean isUserParticipant(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}