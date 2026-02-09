package com.anam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(name = "event_id", nullable = false, length = 50)
    private String eventId;

    @NotBlank
    @Column(name = "event_title", nullable = false, length = 255)
    private String eventTitle;

    @Column(name = "event_date", length = 100)
    private String eventDate;

    @Column(name = "event_location", length = 255)
    private String eventLocation;

    @NotBlank(message = "Nome é obrigatório")
    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @NotBlank(message = "Tipo de participante é obrigatório")
    @Column(name = "participant_type", nullable = false, length = 50)
    private String participantType;

    @Column(name = "receive_whatsapp", nullable = false)
    private Boolean receiveWhatsApp = false;

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
        if (receiveWhatsApp == null) {
            receiveWhatsApp = false;
        }
    }
}
