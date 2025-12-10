package com.vizuo.backend.config;

import com.vizuo.backend.entity.Plan;
import com.vizuo.backend.repository.PlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    
    private final PlanRepository planRepository;

    public DataInitializer(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }
    
    @Bean
    public CommandLineRunner initializePlans() {
        return args -> {
            // Only initialize if no plans exist
            if (planRepository.count() == 0) {
                // Basic Plan (Free)
                Plan basic = new Plan();
                basic.setName("Basic");
                basic.setPriceMonthly(new BigDecimal("0.00"));
                basic.setMaxPremiumDownloads(0);
                basic.setCanUploadPremium(false);
                basic.setDescription("Free forever with access to standard features");
                planRepository.save(basic);
                
                // Advanced Plan
                Plan advanced = new Plan();
                advanced.setName("Advanced");
                advanced.setPriceMonthly(new BigDecimal("299.00"));
                advanced.setMaxPremiumDownloads(20);
                advanced.setCanUploadPremium(false);
                advanced.setDescription("20 premium photo downloads per month");
                planRepository.save(advanced);
                
                // Premium Plan
                Plan premium = new Plan();
                premium.setName("Premium");
                premium.setPriceMonthly(new BigDecimal("499.00"));
                premium.setMaxPremiumDownloads(50);
                premium.setCanUploadPremium(true);
                premium.setDescription("50 premium downloads per month and upload premium content");
                planRepository.save(premium);
                
                // Pro Plan
                Plan pro = new Plan();
                pro.setName("Pro");
                pro.setPriceMonthly(new BigDecimal("799.00"));
                pro.setMaxPremiumDownloads(-1); // -1 means unlimited
                pro.setCanUploadPremium(true);
                pro.setDescription("Unlimited premium downloads and upload premium content");
                planRepository.save(pro);
                
                System.out.println("✓ Plans initialized successfully");
            }
        };
    }
}
