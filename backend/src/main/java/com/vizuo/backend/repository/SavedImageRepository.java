package com.vizuo.backend.repository;

import com.vizuo.backend.entity.SavedImage;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface SavedImageRepository extends JpaRepository<SavedImage, Long> {
    boolean existsByUserAndImage(User user, Image image);
    Optional<SavedImage> findByUserAndImage(User user, Image image);
    List<SavedImage> findByUser(User user);

    @Query("SELECT si FROM SavedImage si WHERE si.user.id = :userId AND si.isSpaceItem = true")
    List<SavedImage> findSpaceItemsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT si FROM SavedImage si WHERE si.user.id = :userId AND si.isSpaceItem = false")
    List<SavedImage> findNonSpaceItemsByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE SavedImage si SET si.isSpaceItem = true WHERE si.id = :savedImageId AND si.user.id = :userId")
    int addToSpace(@Param("savedImageId") Long savedImageId, @Param("userId") Long userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE SavedImage si SET si.isSpaceItem = false WHERE si.id = :savedImageId AND si.user.id = :userId")
    int removeFromSpace(@Param("savedImageId") Long savedImageId, @Param("userId") Long userId);
}
