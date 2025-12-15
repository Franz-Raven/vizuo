package com.vizuo.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String avatar;

    @Column(name = "cover_image")
    private String coverImage;

    @Size(max = 500)
    private String bio;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "commission_rate")
    private Double commissionRate = 0.0;

    // Admin fields
    @Column(name = "last_audit_date")
    private LocalDateTime lastAuditDate;

    @Column(name = "reports_handled")
    private Integer reportsHandled = 0;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"), 
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // for conversations
    @ManyToMany(mappedBy = "participants", fetch = FetchType.LAZY)
    private Set<Conversation> conversations = new HashSet<>();

    public User() {}

    public User(String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.commissionRate = 0.0;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Double getCommissionRate() { return commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }

    public LocalDateTime getLastAuditDate() { return lastAuditDate; }
    public void setLastAuditDate(LocalDateTime lastAuditDate) { this.lastAuditDate = lastAuditDate; }

    public Integer getReportsHandled() { return reportsHandled; }
    public void setReportsHandled(Integer reportsHandled) { this.reportsHandled = reportsHandled; }

    public String getStatus() { return status;}
    public void setStatus(String status) { this.status = status; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
