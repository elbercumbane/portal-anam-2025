package com.anam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupporterRegistrationDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String fullName;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank(message = "Contacto é obrigatório")
    private String phone;

    @NotBlank(message = "Tipo de apoio é obrigatório")
    private String supportType;

    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    @NotNull(message = "Anonimato é obrigatório")
    private Boolean anonymous;

    private Boolean wantsAccount;
    private String phone2;
    private Boolean phoneWhatsApp;
    private Boolean phone2WhatsApp;
    private String registrationDevice;
    private String registrationBrowser;
}
