package com.anam.controller;

import com.anam.dto.SupporterRegistrationDTO;
import com.anam.entity.SupporterRegistration;
import com.anam.repository.SupporterRegistrationRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supporter-registrations")
@CrossOrigin(origins = "*")
public class SupporterRegistrationController {

    @Autowired
    private SupporterRegistrationRepository repository;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody SupporterRegistrationDTO dto, HttpServletRequest request) {
        try {
            SupporterRegistration entity = new SupporterRegistration();
            entity.setFullName(dto.getFullName());
            entity.setEmail(dto.getEmail());
            entity.setPhone(dto.getPhone());
            entity.setSupportType(dto.getSupportType());
            entity.setDescription(dto.getDescription());
            entity.setAnonymous(dto.getAnonymous() != null && dto.getAnonymous());

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

            SupporterRegistration saved = repository.save(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao registar apoiante: " + e.getMessage());
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
    public ResponseEntity<List<SupporterRegistration>> getAll() {
        try {
            List<SupporterRegistration> list = repository.findAllByOrderByCreatedAtDesc();
            if (list == null) {
                list = new java.util.ArrayList<>();
            }
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupporterRegistration> getById(@PathVariable java.util.UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
