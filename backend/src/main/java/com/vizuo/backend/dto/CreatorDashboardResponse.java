package com.vizuo.backend.dto;

import java.math.BigDecimal;

public class CreatorDashboardResponse {

    private String monthLabel;

    private BigDecimal subscriptionRevenue;
    private BigDecimal creatorPool;

    private long totalPremiumDownloads;
    private long yourPremiumDownloads;

    private BigDecimal yourShare;
    private BigDecimal yourPayout;

    public String getMonthLabel() {
        return monthLabel;
    }

    public void setMonthLabel(String monthLabel) {
        this.monthLabel = monthLabel;
    }

    public BigDecimal getSubscriptionRevenue() {
        return subscriptionRevenue;
    }

    public void setSubscriptionRevenue(BigDecimal subscriptionRevenue) {
        this.subscriptionRevenue = subscriptionRevenue;
    }

    public BigDecimal getCreatorPool() {
        return creatorPool;
    }

    public void setCreatorPool(BigDecimal creatorPool) {
        this.creatorPool = creatorPool;
    }

    public long getTotalPremiumDownloads() {
        return totalPremiumDownloads;
    }

    public void setTotalPremiumDownloads(long totalPremiumDownloads) {
        this.totalPremiumDownloads = totalPremiumDownloads;
    }

    public long getYourPremiumDownloads() {
        return yourPremiumDownloads;
    }

    public void setYourPremiumDownloads(long yourPremiumDownloads) {
        this.yourPremiumDownloads = yourPremiumDownloads;
    }

    public BigDecimal getYourShare() {
        return yourShare;
    }

    public void setYourShare(BigDecimal yourShare) {
        this.yourShare = yourShare;
    }

    public BigDecimal getYourPayout() {
        return yourPayout;
    }

    public void setYourPayout(BigDecimal yourPayout) {
        this.yourPayout = yourPayout;
    }
}
