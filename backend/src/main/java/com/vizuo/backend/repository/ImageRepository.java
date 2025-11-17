package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByUserIdOrderByCreatedAtDesc(Long userId);
}
