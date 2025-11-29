package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Moodboard;
import com.vizuo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MoodboardRepository extends JpaRepository<Moodboard, Long> {
    List<Moodboard> findByUser(User user);
}
