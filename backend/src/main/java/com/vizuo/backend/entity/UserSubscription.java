package com.vizuo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "current_period_end", nullable = false)
    private LocalDateTime currentPeriodEnd;
    
    @Column(nullable = false, length = 20)
    private String status; // "active" or "expired"
    
    @Column(name = "premium_downloads_used", nullable = false)
    private Integer premiumDownloadsUsed = 0;

    public UserSubscription() {
    }

    public UserSubscription(Long id, User user, Plan plan, LocalDateTime startDate, LocalDateTime currentPeriodEnd, String status, Integer premiumDownloadsUsed) {
        this.id = id;
        this.user = user;
        this.plan = plan;
        this.startDate = startDate;
        this.currentPeriodEnd = currentPeriodEnd;
        this.status = status;
        this.premiumDownloadsUsed = premiumDownloadsUsed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getCurrentPeriodEnd() {
        return currentPeriodEnd;
    }

    public void setCurrentPeriodEnd(LocalDateTime currentPeriodEnd) {
        this.currentPeriodEnd = currentPeriodEnd;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPremiumDownloadsUsed() {
        return premiumDownloadsUsed;
    }

    public void setPremiumDownloadsUsed(Integer premiumDownloadsUsed) {
        this.premiumDownloadsUsed = premiumDownloadsUsed;
    }
}
