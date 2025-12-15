package com.vizuo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "downloads", indexes = {
        @Index(name = "idx_downloads_downloaded_at", columnList = "downloaded_at"),
        @Index(name = "idx_downloads_user_id", columnList = "user_id"),
        @Index(name = "idx_downloads_image_id", columnList = "image_id")
})
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // downloader

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "image_id", nullable = false)
    private Image image; // downloaded image

    @Column(name = "downloaded_at", nullable = false)
    private LocalDateTime downloadedAt;

    public Download() {}

    public Download(User user, Image image) {
        this.user = user;
        this.image = image;
    }

    @PrePersist
    protected void onCreate() {
        if (downloadedAt == null) downloadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Image getImage() { return image; }
    public void setImage(Image image) { this.image = image; }

    public LocalDateTime getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(LocalDateTime downloadedAt) { this.downloadedAt = downloadedAt; }
}
