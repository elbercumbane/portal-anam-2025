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
public class SympathizerRegistrationDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String fullName;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    private String phone;

    private String nuit;

    @NotBlank(message = "Área de interesse é obrigatória")
    private String areaInterest;

    @NotNull(message = "Aceitar comunicações é obrigatório")
    private Boolean acceptCommunications;

    private String registrationDevice;
    private String registrationBrowser;
}
