package com.vizuo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name")
    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "image_keywords", joinColumns = @JoinColumn(name = "image_id"))
    @Column(name = "keyword")
    private List<String> keywords = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "image_previews", joinColumns = @JoinColumn(name = "image_id"))
    @Column(name = "preview_url")
    private List<String> previewUrls = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "image_attachments", joinColumns = @JoinColumn(name = "image_id"))
    @Column(name = "attachment_url")
    private List<String> attachmentUrls = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Image() {}

    public Image(User user, String fileName, String description) {
        this.user = user;
        this.fileName = fileName;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }

    public List<String> getPreviewUrls() { return previewUrls; }
    public void setPreviewUrls(List<String> previewUrls) { this.previewUrls = previewUrls; }

    public List<String> getAttachmentUrls() { return attachmentUrls; }
    public void setAttachmentUrls(List<String> attachmentUrls) { this.attachmentUrls = attachmentUrls; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
