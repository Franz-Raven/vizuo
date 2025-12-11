package com.vizuo.backend.service;

import com.vizuo.backend.dto.PlanResponse;
import com.vizuo.backend.dto.UserSubscriptionResponse;
import com.vizuo.backend.entity.Plan;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.entity.UserSubscription;
import com.vizuo.backend.repository.PlanRepository;
import com.vizuo.backend.repository.UserRepository;
import com.vizuo.backend.repository.UserSubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    
    private final PlanRepository planRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository;

    public SubscriptionService(PlanRepository planRepository, UserSubscriptionRepository userSubscriptionRepository, UserRepository userRepository) {
        this.planRepository = planRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.userRepository = userRepository;
    }
    
    public List<PlanResponse> getAllPlans() {
        return planRepository.findAll().stream()
                .map(this::convertToPlanResponse)
                .collect(Collectors.toList());
    }
    
    public UserSubscriptionResponse getCurrentSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check for active subscription first
        UserSubscription subscription = userSubscriptionRepository
                .findByUserAndStatus(user, "active")
                .orElse(null);
        
        // If no active subscription, check if user has expired subscription or create basic
        if (subscription == null) {
            subscription = userSubscriptionRepository
                    .findTopByUserOrderByStartDateDesc(user)
                    .orElse(null);
            
            // If no subscription at all, create a Basic one
            if (subscription == null) {
                Plan basicPlan = planRepository.findByName("Basic")
                        .orElseThrow(() -> new RuntimeException("Basic plan not found"));
                subscription = createSubscription(user, basicPlan);
            } else if ("expired".equals(subscription.getStatus())) {
                // If last subscription is expired, revert to Basic
                Plan basicPlan = planRepository.findByName("Basic")
                        .orElseThrow(() -> new RuntimeException("Basic plan not found"));
                subscription = createSubscription(user, basicPlan);
            }
        }
        
        // Check if subscription has expired
        if ("active".equals(subscription.getStatus()) && 
            LocalDateTime.now().isAfter(subscription.getCurrentPeriodEnd())) {
            subscription.setStatus("expired");
            userSubscriptionRepository.save(subscription);
            
            // Create new Basic subscription
            Plan basicPlan = planRepository.findByName("Basic")
                    .orElseThrow(() -> new RuntimeException("Basic plan not found"));
            subscription = createSubscription(user, basicPlan);
        }
        
        return convertToSubscriptionResponse(subscription);
    }
    
    @Transactional
    public UserSubscriptionResponse subscribeToPlan(Long userId, Long planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        // Get current active subscription
        UserSubscription currentSubscription = userSubscriptionRepository
                .findByUserAndStatus(user, "active")
                .orElse(null);
        
        // If user has an active subscription, expire it
        if (currentSubscription != null) {
            currentSubscription.setStatus("expired");
            userSubscriptionRepository.save(currentSubscription);
        }
        
        // Create new subscription
        UserSubscription newSubscription = createSubscription(user, plan);
        
        return convertToSubscriptionResponse(newSubscription);
    }
    
    private UserSubscription createSubscription(User user, Plan plan) {
        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDateTime.now());
        
        // Set period end based on plan type
        if ("Basic".equals(plan.getName())) {
            // Basic plan never expires (set far future date)
            subscription.setCurrentPeriodEnd(LocalDateTime.now().plusYears(100));
        } else {
            // Paid plans expire after 30 days
            subscription.setCurrentPeriodEnd(LocalDateTime.now().plusDays(30));
        }
        
        subscription.setStatus("active");
        subscription.setPremiumDownloadsUsed(0);
        
        return userSubscriptionRepository.save(subscription);
    }
    
    private PlanResponse convertToPlanResponse(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setPriceMonthly(plan.getPriceMonthly());
        response.setMaxPremiumDownloads(plan.getMaxPremiumDownloads());
        response.setCanUploadPremium(plan.getCanUploadPremium());
        response.setDescription(plan.getDescription());
        return response;
    }
    
    private UserSubscriptionResponse convertToSubscriptionResponse(UserSubscription subscription) {
        UserSubscriptionResponse response = new UserSubscriptionResponse();
        response.setId(subscription.getId());
        response.setPlan(convertToPlanResponse(subscription.getPlan()));
        response.setStartDate(subscription.getStartDate());
        response.setCurrentPeriodEnd(subscription.getCurrentPeriodEnd());
        response.setStatus(subscription.getStatus());
        response.setPremiumDownloadsUsed(subscription.getPremiumDownloadsUsed());
        
        // Calculate remaining downloads
        int maxDownloads = subscription.getPlan().getMaxPremiumDownloads();
        if (maxDownloads == -1) {
            response.setPremiumDownloadsRemaining(-1); // Unlimited
        } else {
            response.setPremiumDownloadsRemaining(
                Math.max(0, maxDownloads - subscription.getPremiumDownloadsUsed())
            );
        }
        
        return response;
    }
}
