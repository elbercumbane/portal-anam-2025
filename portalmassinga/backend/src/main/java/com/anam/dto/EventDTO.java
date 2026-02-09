package com.anam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {

    private String id;
    private String title;
    private String eventDate;
    private String eventDateStart;
    private String eventDateEnd;
    private LocalDate endDate;
    private String location;
    private String timeSlot;
    private String description;
    private String imageUrl;
    private String levelAccess;
    private Boolean isCancelled;
    private LocalDateTime cancelledAt;
    private String cancelledMessage;
    private Long registrationCount;
    private Boolean canEdit;   // false se evento já passou ou está cancelado
    private Boolean canCancel; // false se evento já passou ou já cancelado
}
