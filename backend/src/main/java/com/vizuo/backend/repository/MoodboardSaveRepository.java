package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Moodboard;
import com.vizuo.backend.entity.MoodboardSave;
import com.vizuo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MoodboardSaveRepository extends JpaRepository<MoodboardSave, Long> {
    Optional<MoodboardSave> findByUserAndMoodboard(User user, Moodboard moodboard);
    List<MoodboardSave> findByUser(User user);
    long countByMoodboard(Moodboard moodboard);
    boolean existsByUserAndMoodboard(User user, Moodboard moodboard);
    void deleteByMoodboard(Moodboard moodboard);
}
