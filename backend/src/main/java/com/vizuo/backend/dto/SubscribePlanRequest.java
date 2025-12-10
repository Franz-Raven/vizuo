package com.vizuo.backend.dto;

public class SubscribePlanRequest {
    private Long planId;

    public SubscribePlanRequest() {
    }

    public SubscribePlanRequest(Long planId) {
        this.planId = planId;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }
}
