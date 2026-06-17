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
@Table(name = "supporter_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupporterRegistration {

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

    @NotBlank(message = "Contacto é obrigatório")
    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @NotBlank(message = "Tipo de apoio é obrigatório")
    @Column(name = "support_type", nullable = false, length = 100)
    private String supportType;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Anonimato é obrigatório")
    @Column(name = "anonymous", nullable = false)
    private Boolean anonymous = false;

    @Column(name = "wants_account", nullable = false)
    private Boolean wantsAccount = false;

    @Column(name = "funds_confirmed", nullable = false)
    private Boolean fundsConfirmed = false;

    @Column(name = "account_created", nullable = false)
    private Boolean accountCreated = false;

    @Column(name = "phone_2", length = 50)
    private String phone2;

    @Column(name = "phone_whatsapp")
    private Boolean phoneWhatsApp = false;

    @Column(name = "phone_2_whatsapp")
    private Boolean phone2WhatsApp = false;

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
        if (anonymous == null) {
            anonymous = false;
        }
    }
}
