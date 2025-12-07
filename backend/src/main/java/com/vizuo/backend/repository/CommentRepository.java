// src/main/java/com/vizuo/backend/repository/CommentRepository.java
package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByImageIdOrderByCreatedAtAsc(Long imageId);
}
