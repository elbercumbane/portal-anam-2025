package com.anam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelEventDTO {

    @NotBlank(message = "A mensagem de desculpas é obrigatória")
    private String message;
}
