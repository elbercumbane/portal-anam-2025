package com.anam.controller;

import com.anam.dto.EventRegistrationDTO;
import com.anam.entity.EventRegistration;
import com.anam.repository.EventRegistrationRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event-registrations")
@CrossOrigin(origins = "*")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationRepository repository;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody EventRegistrationDTO dto, HttpServletRequest request) {
        try {
            EventRegistration entity = new EventRegistration();
            entity.setEventId(dto.getEventId());
            entity.setEventTitle(dto.getEventTitle());
            entity.setEventDate(dto.getEventDate());
            entity.setEventLocation(dto.getEventLocation());
            entity.setFullName(dto.getFullName());
            entity.setEmail(dto.getEmail());
            entity.setPhone(dto.getPhone());
            entity.setParticipantType(dto.getParticipantType());
            entity.setReceiveWhatsApp(dto.getReceiveWhatsApp() != null && dto.getReceiveWhatsApp());

            String userAgent = request.getHeader("User-Agent");
            if (userAgent != null) {
                entity.setRegistrationUserAgent(userAgent);
                entity.setRegistrationDevice(dto.getRegistrationDevice() != null && !dto.getRegistrationDevice().isBlank()
                        ? dto.getRegistrationDevice() : detectDevice(userAgent));
                entity.setRegistrationBrowser(dto.getRegistrationBrowser() != null && !dto.getRegistrationBrowser().isBlank()
                        ? dto.getRegistrationBrowser() : detectBrowser(userAgent));
            } else {
                entity.setRegistrationDevice(dto.getRegistrationDevice());
                entity.setRegistrationBrowser(dto.getRegistrationBrowser());
            }

            EventRegistration saved = repository.save(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao registar inscrição no evento: " + e.getMessage());
        }
    }

    private String detectDevice(String userAgent) {
        if (userAgent == null) return null;
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") && !ua.contains("tablet")) return "Mobile";
        if (ua.contains("tablet") || ua.contains("ipad")) return "Tablet";
        return "Desktop";
    }

    private String detectBrowser(String userAgent) {
        if (userAgent == null) return null;
        if (userAgent.contains("Edg/")) return "Edge";
        if (userAgent.contains("Chrome/") && !userAgent.contains("Edg")) return "Chrome";
        if (userAgent.contains("Firefox/")) return "Firefox";
        if (userAgent.contains("Safari/") && !userAgent.contains("Chrome")) return "Safari";
        if (userAgent.contains("OPR/") || userAgent.contains("Opera")) return "Opera";
        return "Outro";
    }

    @GetMapping
    public ResponseEntity<List<EventRegistration>> getAll(
            @RequestParam(required = false) String eventId,
            @RequestParam(required = false) String participantType) {
        try {
            List<EventRegistration> list;
            if (eventId != null && !eventId.isBlank()) {
                if (participantType != null && !participantType.isBlank()) {
                    list = repository.findByEventIdAndParticipantTypeOrderByCreatedAtDesc(eventId.trim(), participantType.trim());
                } else {
                    list = repository.findByEventIdOrderByCreatedAtDesc(eventId.trim());
                }
            } else {
                list = repository.findAllByOrderByCreatedAtDesc();
            }
            if (list == null) {
                list = new java.util.ArrayList<>();
            }
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRegistration> getById(@PathVariable java.util.UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
