package com.vizuo.backend.controller;

import com.vizuo.backend.dto.UserSubscriptionResponse;
import com.vizuo.backend.service.DownloadService;
import com.vizuo.backend.dto.RegisterPremiumDownloadRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/downloads")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DownloadController {

    private final DownloadService downloadService;

    public DownloadController(DownloadService downloadService) {
        this.downloadService = downloadService;
    }

    @PostMapping("/premium/use")
    public ResponseEntity<UserSubscriptionResponse> registerPremiumDownload(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        UserSubscriptionResponse response = downloadService.registerPremiumDownload(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/premium/track")
    public ResponseEntity<UserSubscriptionResponse> registerPremiumDownloadForImage(
            Authentication authentication,
            @RequestBody RegisterPremiumDownloadRequest body
    ) {
        Long userId = Long.parseLong(authentication.getName());
        UserSubscriptionResponse response = downloadService.registerPremiumDownloadForImage(userId, body.getImageId());
        return ResponseEntity.ok(response);
    }
}
