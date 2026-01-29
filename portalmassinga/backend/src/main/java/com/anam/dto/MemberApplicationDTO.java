package com.anam.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class MemberApplicationDTO {

    // Personal Data (Required)
    private String photo;
    
    @NotBlank(message = "Nome completo é obrigatório")
    private String fullName;
    
    @NotBlank(message = "Nome do pai é obrigatório")
    private String fatherName;
    
    @NotBlank(message = "Nome da mãe é obrigatório")
    private String motherName;
    
    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate birthDate;
    
    @NotBlank(message = "Estado civil é obrigatório")
    private String maritalStatus;
    
    @NotBlank(message = "Profissão é obrigatória")
    private String profession;

    // Contacts (Required)
    @NotBlank(message = "Celular é obrigatório")
    private String mobilePhone;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    private String phone; // Optional
    
    @NotBlank(message = "Rua/Avenida é obrigatória")
    private String street;
    
    @NotBlank(message = "Bairro é obrigatório")
    private String neighborhood;
    
    @NotBlank(message = "Cidade é obrigatória")
    private String city;

    // Spouse Information (Optional)
    private String spouseName;
    private LocalDate spouseBirthDate;
    private String spouseFatherName;
    private String spouseMotherName;

    // Dependents (Optional)
    @Valid
    private List<DependentDTO> dependents = new ArrayList<>();

    // Workplace (Optional)
    private String workplace;
    private String position;
    private String workAddress;
    private String workPhone;

    // Additional Information (Optional)
    private String additionalInformation;

    // Honor Commitment
    @NotNull(message = "Aceitar termos é obrigatório")
    private Boolean acceptsTerms;

    @Data
    public static class DependentDTO {
        @NotBlank(message = "Nome do dependente é obrigatório")
        private String name;
        
        @NotBlank(message = "Parentesco é obrigatório")
        private String relationship; // child, stepchild, other
        
        private String profession;
        private Integer age;
    }
}
