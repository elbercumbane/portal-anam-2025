package com.anam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id;

    @NotBlank
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "event_date", length = 100)
    private String eventDate;

    @Column(name = "event_date_start", length = 100)
    private String eventDateStart;

    @Column(name = "event_date_end", length = 100)
    private String eventDateEnd;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "time_slot", length = 100)
    private String timeSlot;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "level_access", length = 50)
    private String levelAccess;

    @Column(name = "is_cancelled", nullable = false)
    private Boolean isCancelled = false;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_message", columnDefinition = "TEXT")
    private String cancelledMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isPast() {
        return endDate != null && endDate.isBefore(LocalDate.now());
    }
}
