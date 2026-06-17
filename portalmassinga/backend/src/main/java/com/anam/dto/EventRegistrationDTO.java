package com.anam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationDTO {

    @NotBlank(message = "ID do evento é obrigatório")
    private String eventId;

    @NotBlank(message = "Título do evento é obrigatório")
    private String eventTitle;

    private String eventDate;
    private String eventLocation;

    @NotBlank(message = "Nome é obrigatório")
    private String fullName;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    private String phone;

    @NotBlank(message = "Tipo de participante é obrigatório")
    private String participantType;

    private Boolean receiveWhatsApp = false;

    private String registrationDevice;
    private String registrationBrowser;
}
