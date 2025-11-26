package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId")
    List<Conversation> findByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id IN :userIds GROUP BY c HAVING COUNT(p) = :userCount")
    Optional<Conversation> findConversationByUserIds(@Param("userIds") List<Long> userIds, @Param("userCount") Long userCount);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Conversation c JOIN c.participants p WHERE c.id = :conversationId AND p.id = :userId")
    Boolean isUserInConversation(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}