package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Like;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.vizuo.backend.entity.User;
import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByImage_IdAndUser_Id(Long imageId, Long userId);

    long countByImage_Id(Long imageId);

    boolean existsByImage_IdAndUser_Id(Long imageId, Long userId);

    void deleteByImage_IdAndUser_Id(Long imageId, Long userId);

    List<Like> findByUser(User user);

    List<Like> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("select l.image.id from Like l where l.user.id = :userId")
    List<Long> findLikedImageIdsByUserId(Long userId);

    @Query("select l.image.id, count(l.id) from Like l where l.image.id in :imageIds group by l.image.id")
    List<Object[]> countLikesForImageIds(List<Long> imageIds);
}
