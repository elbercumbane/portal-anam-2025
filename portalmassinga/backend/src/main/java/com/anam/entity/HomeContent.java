package com.anam.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "home_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeContent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "section_key", nullable = false, unique = true, length = 100)
    private String sectionKey; // Ex: "hero_slide_1", "hero_slide_2", "sobre_anam", etc.

    @Column(name = "title", columnDefinition = "TEXT")
    private String title;

    @Column(name = "subtitle", columnDefinition = "TEXT")
    private String subtitle;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // Para conteúdo HTML ou texto longo

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "order_index")
    private Integer orderIndex; // Para ordenação

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON para dados adicionais

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

