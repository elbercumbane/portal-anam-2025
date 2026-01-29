package com.anam.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "member_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Personal Data (Required)
    @Column(name = "photo", columnDefinition = "TEXT")
    private String photo; // Base64 or URL

    @NotBlank(message = "Nome completo é obrigatório")
    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @NotBlank(message = "Nome do pai é obrigatório")
    @Column(name = "father_name", nullable = false, length = 255)
    private String fatherName;

    @NotBlank(message = "Nome da mãe é obrigatório")
    @Column(name = "mother_name", nullable = false, length = 255)
    private String motherName;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @NotBlank(message = "Estado civil é obrigatório")
    @Column(name = "marital_status", nullable = false, length = 50)
    private String maritalStatus;

    @NotBlank(message = "Profissão é obrigatória")
    @Column(name = "profession", nullable = false, length = 255)
    private String profession;

    // Contacts (Required)
    @NotBlank(message = "Celular é obrigatório")
    @Column(name = "mobile_phone", nullable = false, length = 20)
    private String mobilePhone;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone; // Optional

    @NotBlank(message = "Rua/Avenida é obrigatória")
    @Column(name = "street", nullable = false, length = 255)
    private String street;

    @NotBlank(message = "Bairro é obrigatório")
    @Column(name = "neighborhood", nullable = false, length = 255)
    private String neighborhood;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(name = "city", nullable = false, length = 255)
    private String city;

    // Spouse Information (Optional)
    @Column(name = "spouse_name", length = 255)
    private String spouseName;

    @Column(name = "spouse_birth_date")
    private LocalDate spouseBirthDate;

    @Column(name = "spouse_father_name", length = 255)
    private String spouseFatherName;

    @Column(name = "spouse_mother_name", length = 255)
    private String spouseMotherName;

    // Workplace (Optional)
    @Column(name = "workplace", length = 255)
    private String workplace;

    @Column(name = "position", length = 255)
    private String position;

    @Column(name = "work_address", length = 255)
    private String workAddress;

    @Column(name = "work_phone", length = 20)
    private String workPhone;

    // Additional Information (Optional)
    @Column(name = "additional_information", columnDefinition = "TEXT")
    private String additionalInformation;

    // Honor Commitment
    @NotNull(message = "Aceitar termos é obrigatório")
    @Column(name = "accepts_terms", nullable = false)
    private Boolean acceptsTerms = false;

    // Application Status
    @Column(name = "status", length = 50)
    private String status = "Pending"; // Pending, Approved, Rejected

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    // Relationship with dependents
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<ApplicationDependent> dependents = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "Pending";
        }
        if (acceptsTerms == null) {
            acceptsTerms = false;
        }
    }
}
