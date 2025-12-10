package com.vizuo.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_images")
public class SavedImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "image_id", nullable = false)
    private Image image;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    @Column(name = "is_space_item", nullable = false)
    private boolean isSpaceItem = false;

    @PrePersist
    protected void onCreate() {
        if (addedAt == null) {
            addedAt = LocalDateTime.now();
        }
    }

    public SavedImage() {}

    public SavedImage(User user, Image image) {
        this.user = user;
        this.image = image;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Image getImage() { return image; }
    public void setImage(Image image) { this.image = image; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public boolean isSpaceItem() { return isSpaceItem; }
    public void setSpaceItem(boolean spaceItem) { isSpaceItem = spaceItem; }
}
