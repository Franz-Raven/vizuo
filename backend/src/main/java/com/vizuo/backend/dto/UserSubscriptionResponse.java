package com.vizuo.backend.dto;

import java.time.LocalDateTime;

public class UserSubscriptionResponse {
    private Long id;
    private PlanResponse plan;
    private LocalDateTime startDate;
    private LocalDateTime currentPeriodEnd;
    private String status;
    private Integer premiumDownloadsUsed;
    private Integer premiumDownloadsRemaining;

    public UserSubscriptionResponse() {
    }

    public UserSubscriptionResponse(Long id, PlanResponse plan, LocalDateTime startDate, LocalDateTime currentPeriodEnd, String status, Integer premiumDownloadsUsed, Integer premiumDownloadsRemaining) {
        this.id = id;
        this.plan = plan;
        this.startDate = startDate;
        this.currentPeriodEnd = currentPeriodEnd;
        this.status = status;
        this.premiumDownloadsUsed = premiumDownloadsUsed;
        this.premiumDownloadsRemaining = premiumDownloadsRemaining;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanResponse getPlan() {
        return plan;
    }

    public void setPlan(PlanResponse plan) {
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

    public Integer getPremiumDownloadsRemaining() {
        return premiumDownloadsRemaining;
    }

    public void setPremiumDownloadsRemaining(Integer premiumDownloadsRemaining) {
        this.premiumDownloadsRemaining = premiumDownloadsRemaining;
    }
}
