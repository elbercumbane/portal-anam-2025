package com.anam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventDTO {

    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String eventDateStart;
    private String eventDateEnd;
    private LocalDate endDate;

    private String location;
    private String timeSlot;
    private String description;
    private String imageUrl;
    private String levelAccess;
}
