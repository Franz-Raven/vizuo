package com.vizuo.backend.service;

import com.vizuo.backend.dto.UserSubscriptionResponse;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.UserSubscription;
import com.vizuo.backend.entity.Download;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.repository.DownloadRepository;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.UserRepository;
import com.vizuo.backend.repository.UserSubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DownloadService {

    private final UserRepository userRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SubscriptionService subscriptionService;
    private final ImageRepository imageRepository;
    private final DownloadRepository downloadRepository;

    public DownloadService(
            UserRepository userRepository,
            UserSubscriptionRepository userSubscriptionRepository,
            SubscriptionService subscriptionService,
            ImageRepository imageRepository,
            DownloadRepository downloadRepository
    ) {
        this.userRepository = userRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.subscriptionService = subscriptionService;
        this.imageRepository = imageRepository;
        this.downloadRepository = downloadRepository;
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

    @Transactional
    public UserSubscriptionResponse registerPremiumDownloadForImage(Long userId, Long imageId) {
        if (imageId == null) {
            throw new RuntimeException("Image ID is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if (Boolean.FALSE.equals(image.getStatus())) {
            throw new RuntimeException("Image is not available");
        }

        if (Boolean.FALSE.equals(image.getPremium())) {
            throw new RuntimeException("Image is not premium");
        }

        UserSubscriptionResponse updated = registerPremiumDownload(userId);

        Download download = new Download(user, image);
        downloadRepository.save(download);

        return updated;
    }
}
