package com.vizuo.backend.repository;

import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findByUserAndStatus(User user, String status);
    Optional<UserSubscription> findTopByUserOrderByStartDateDesc(User user);
}
