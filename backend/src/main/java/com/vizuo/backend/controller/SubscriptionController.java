package com.vizuo.backend.controller;

import com.vizuo.backend.dto.PlanResponse;
import com.vizuo.backend.dto.SubscribePlanRequest;
import com.vizuo.backend.dto.UserSubscriptionResponse;
import com.vizuo.backend.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    
    @GetMapping("/plans")
    public ResponseEntity<List<PlanResponse>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }
    
    @GetMapping("/current")
    public ResponseEntity<UserSubscriptionResponse> getCurrentSubscription(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription(email));
    }
    
    @PostMapping("/subscribe")
    public ResponseEntity<UserSubscriptionResponse> subscribeToPlan(
            @RequestBody SubscribePlanRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(subscriptionService.subscribeToPlan(email, request.getPlanId()));
    }
}
