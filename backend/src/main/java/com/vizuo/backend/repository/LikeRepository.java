package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByImage_IdAndUser_Id(Long imageId, Long userId);

    long countByImage_Id(Long imageId);

    boolean existsByImage_IdAndUser_Id(Long imageId, Long userId);

    void deleteByImage_IdAndUser_Id(Long imageId, Long userId);
}
