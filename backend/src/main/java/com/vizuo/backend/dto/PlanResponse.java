package com.vizuo.backend.dto;

import java.math.BigDecimal;

public class PlanResponse {
    private Long id;
    private String name;
    private BigDecimal priceMonthly;
    private Integer maxPremiumDownloads;
    private Boolean canUploadPremium;
    private String description;

    public PlanResponse() {
    }

    public PlanResponse(Long id, String name, BigDecimal priceMonthly, Integer maxPremiumDownloads, Boolean canUploadPremium, String description) {
        this.id = id;
        this.name = name;
        this.priceMonthly = priceMonthly;
        this.maxPremiumDownloads = maxPremiumDownloads;
        this.canUploadPremium = canUploadPremium;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPriceMonthly() {
        return priceMonthly;
    }

    public void setPriceMonthly(BigDecimal priceMonthly) {
        this.priceMonthly = priceMonthly;
    }

    public Integer getMaxPremiumDownloads() {
        return maxPremiumDownloads;
    }

    public void setMaxPremiumDownloads(Integer maxPremiumDownloads) {
        this.maxPremiumDownloads = maxPremiumDownloads;
    }

    public Boolean getCanUploadPremium() {
        return canUploadPremium;
    }

    public void setCanUploadPremium(Boolean canUploadPremium) {
        this.canUploadPremium = canUploadPremium;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
