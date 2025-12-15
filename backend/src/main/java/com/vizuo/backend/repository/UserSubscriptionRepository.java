package com.vizuo.backend.repository;

import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findByUserAndStatus(User user, String status);
    Optional<UserSubscription> findTopByUserOrderByStartDateDesc(User user);
    List<UserSubscription> findByStatusAndStartDateGreaterThanEqualAndStartDateLessThan(
        String status,
        LocalDateTime start,
        LocalDateTime end
);
}
