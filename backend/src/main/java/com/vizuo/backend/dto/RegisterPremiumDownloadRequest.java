package com.vizuo.backend.dto;

public class RegisterPremiumDownloadRequest {
    private Long imageId;

    public RegisterPremiumDownloadRequest() {}

    public RegisterPremiumDownloadRequest(Long imageId) {
        this.imageId = imageId;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }
}
