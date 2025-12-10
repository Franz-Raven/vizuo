package com.vizuo.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "plans")
public class Plan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(name = "price_monthly", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceMonthly;
    
    @Column(name = "max_premium_downloads", nullable = false)
    private Integer maxPremiumDownloads;
    
    @Column(name = "can_upload_premium", nullable = false)
    private Boolean canUploadPremium;
    
    @Column(length = 1000)
    private String description;

    public Plan() {
    }

    public Plan(Long id, String name, BigDecimal priceMonthly, Integer maxPremiumDownloads, Boolean canUploadPremium, String description) {
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
