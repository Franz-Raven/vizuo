package com.vizuo.backend.service;

import com.vizuo.backend.dto.UserSubscriptionResponse;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.UserSubscription;
import com.vizuo.backend.repository.UserRepository;
import com.vizuo.backend.repository.UserSubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DownloadService {

    private final UserRepository userRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SubscriptionService subscriptionService;

    public DownloadService(
            UserRepository userRepository,
            UserSubscriptionRepository userSubscriptionRepository,
            SubscriptionService subscriptionService
    ) {
        this.userRepository = userRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.subscriptionService = subscriptionService;
    }

    @Transactional
    public UserSubscriptionResponse registerPremiumDownload(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        subscriptionService.getCurrentSubscription(userId);

        UserSubscription subscription = userSubscriptionRepository
                .findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("Active subscription not found"));

        Integer used = subscription.getPremiumDownloadsUsed();
        if (used == null) {
            used = 0;
        }
        subscription.setPremiumDownloadsUsed(used + 1);
        userSubscriptionRepository.save(subscription);

        return subscriptionService.getCurrentSubscription(userId);
    }
}
