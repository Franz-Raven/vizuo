package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    long countByImage_Id(Long imageId);

    boolean existsByImage_IdAndUser_Id(Long imageId, Long userId);

    void deleteByImage_IdAndUser_Id(Long imageId, Long userId);
}
