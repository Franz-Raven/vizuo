package com.vizuo.backend.repository;

import com.vizuo.backend.entity.SavedImage;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedImageRepository extends JpaRepository<SavedImage, Long> {
    boolean existsByUserAndImage(User user, Image image);
    Optional<SavedImage> findByUserAndImage(User user, Image image);
    List<SavedImage> findByUser(User user);
}
