package com.anam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sympathizer_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SympathizerRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "nuit", length = 21)
    private String nuit;

    @NotBlank(message = "Área de interesse é obrigatória")
    @Column(name = "area_interest", nullable = false, length = 255)
    private String areaInterest;

    @NotNull(message = "Consentimento de comunicações é obrigatório")
    @Column(name = "accept_communications", nullable = false)
    private Boolean acceptCommunications = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "registration_device", length = 255)
    private String registrationDevice;

    @Column(name = "registration_browser", length = 255)
    private String registrationBrowser;

    @Column(name = "registration_user_agent", columnDefinition = "TEXT")
    private String registrationUserAgent;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (acceptCommunications == null) {
            acceptCommunications = false;
        }
    }
}
