package com.anam.controller;

import com.anam.dto.MemberApplicationDTO;
import com.anam.dto.RejectApplicationDTO;
import com.anam.entity.ApplicationDependent;
import com.anam.entity.MemberApplication;
import com.anam.entity.User;
import com.anam.repository.MemberApplicationRepository;
import com.anam.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/member-applications")
@CrossOrigin(origins = "*")
public class MemberApplicationController {

    @Autowired
    private MemberApplicationRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> createApplication(@Valid @RequestBody MemberApplicationDTO dto,
                                                HttpServletRequest request) {
        try {
            // Converter DTO para Entity
            MemberApplication application = convertToEntity(dto);

            // Registo: dispositivo, navegador e User-Agent
            String userAgent = request.getHeader("User-Agent");
            if (userAgent != null) {
                application.setRegistrationUserAgent(userAgent);
                if (dto.getRegistrationDevice() != null && !dto.getRegistrationDevice().isBlank()) {
                    application.setRegistrationDevice(dto.getRegistrationDevice());
                } else {
                    application.setRegistrationDevice(detectDevice(userAgent));
                }
                if (dto.getRegistrationBrowser() != null && !dto.getRegistrationBrowser().isBlank()) {
                    application.setRegistrationBrowser(dto.getRegistrationBrowser());
                } else {
                    application.setRegistrationBrowser(detectBrowser(userAgent));
                }
            } else {
                application.setRegistrationDevice(dto.getRegistrationDevice());
                application.setRegistrationBrowser(dto.getRegistrationBrowser());
            }
            // created_at é preenchido automaticamente na entidade (data de registo)

            // Salvar candidatura
            MemberApplication saved = repository.save(application);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao criar candidatura: " + e.getMessage());
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
    public ResponseEntity<List<MemberApplication>> getAllApplications(
            @RequestParam(required = false) String status) {
        try {
            List<MemberApplication> applications;
            if (status != null && !status.isEmpty()) {
                applications = repository.findByStatus(status);
            } else {
                applications = repository.findAll();
            }
            
            // Garantir que sempre retorna uma lista (nunca null)
            if (applications == null) {
                applications = new java.util.ArrayList<>();
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            // Retornar lista vazia em caso de erro
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberApplication> getApplicationById(@PathVariable UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Busca candidatura por NUIT (público - para página Pagar Cotas) */
    @GetMapping("/by-nuit/{nuit}")
    public ResponseEntity<MemberApplication> getApplicationByNuit(@PathVariable String nuit) {
        if (nuit == null || nuit.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return repository.findByNuitIgnoreCase(nuit.trim())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable UUID id) {
        return repository.findById(id)
                .map(application -> {
                    application.setStatus("Approved");
                    application.setApprovedAt(java.time.LocalDateTime.now());
                    MemberApplication saved = repository.save(application);
                    // Criar conta de utilizador para o membro (senha padrão: membro123)
                    createMemberUserIfNotExists(saved);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void createMemberUserIfNotExists(MemberApplication app) {
        if (app.getEmail() == null || app.getEmail().isBlank()) return;
        if (userRepository.existsByEmailIgnoreCase(app.getEmail())) return;
        String defaultPassword = "anam" + java.time.Year.now().getValue();
        User user = new User();
        user.setEmail(app.getEmail().trim().toLowerCase());
        user.setFullName(app.getFullName());
        user.setPasswordHash(passwordEncoder.encode(defaultPassword));
        user.setRole("membro");
        user.setMemberApplicationId(app.getId());
        user.setMustChangePassword(true);
        userRepository.save(user);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable UUID id, 
                                                @RequestBody(required = false) RejectApplicationDTO rejectDTO) {
        return repository.findById(id)
                .map(application -> {
                    application.setStatus("Rejected");
                    if (rejectDTO != null && rejectDTO.getObservations() != null && !rejectDTO.getObservations().trim().isEmpty()) {
                        application.setObservations(rejectDTO.getObservations());
                    }
                    return ResponseEntity.ok(repository.save(application));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Desativa um membro (soft delete - status Inactive) */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateApplication(@PathVariable UUID id) {
        return repository.findById(id)
                .map(application -> {
                    application.setStatus("Inactive");
                    return ResponseEntity.ok(repository.save(application));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Atualiza uma candidatura (edição) */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable UUID id,
                                               @Valid @RequestBody MemberApplicationDTO dto) {
        return repository.findById(id)
                .map(existing -> {
                    updateEntityFromDto(existing, dto);
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void updateEntityFromDto(MemberApplication app, MemberApplicationDTO dto) {
        app.setPhoto(dto.getPhoto());
        app.setFullName(dto.getFullName());
        app.setFatherName(dto.getFatherName());
        app.setMotherName(dto.getMotherName());
        app.setBirthDate(dto.getBirthDate());
        app.setMaritalStatus(dto.getMaritalStatus());
        app.setProfession(dto.getProfession());
        app.setNuit(dto.getNuit());
        app.setMobilePhone(dto.getMobilePhone());
        app.setEmail(dto.getEmail());
        app.setPhone(dto.getPhone());
        app.setStreet(dto.getStreet());
        app.setNeighborhood(dto.getNeighborhood());
        app.setCity(dto.getCity());
        app.setSpouseName(dto.getSpouseName());
        app.setSpouseBirthDate(dto.getSpouseBirthDate());
        app.setSpouseFatherName(dto.getSpouseFatherName());
        app.setSpouseMotherName(dto.getSpouseMotherName());
        app.setWorkplace(dto.getWorkplace());
        app.setPosition(dto.getPosition());
        app.setWorkAddress(dto.getWorkAddress());
        app.setWorkPhone(dto.getWorkPhone());
        app.setAdditionalInformation(dto.getAdditionalInformation());
        app.setAcceptsTerms(dto.getAcceptsTerms() != null ? dto.getAcceptsTerms() : false);
        // Dependentes: remover antigos e adicionar novos
        app.getDependents().clear();
        if (dto.getDependents() != null && !dto.getDependents().isEmpty()) {
            for (MemberApplicationDTO.DependentDTO depDto : dto.getDependents()) {
                ApplicationDependent dep = new ApplicationDependent();
                dep.setApplication(app);
                dep.setName(depDto.getName());
                dep.setRelationship(depDto.getRelationship());
                dep.setProfession(depDto.getProfession());
                dep.setAge(depDto.getAge());
                app.getDependents().add(dep);
            }
        }
    }

    private MemberApplication convertToEntity(MemberApplicationDTO dto) {
        MemberApplication application = new MemberApplication();
        
        // Personal Data
        application.setPhoto(dto.getPhoto());
        application.setFullName(dto.getFullName());
        application.setFatherName(dto.getFatherName());
        application.setMotherName(dto.getMotherName());
        application.setBirthDate(dto.getBirthDate());
        application.setMaritalStatus(dto.getMaritalStatus());
        application.setProfession(dto.getProfession());
        application.setNuit(dto.getNuit());
        
        // Contacts
        application.setMobilePhone(dto.getMobilePhone());
        application.setEmail(dto.getEmail());
        application.setPhone(dto.getPhone());
        application.setStreet(dto.getStreet());
        application.setNeighborhood(dto.getNeighborhood());
        application.setCity(dto.getCity());
        
        // Spouse
        application.setSpouseName(dto.getSpouseName());
        application.setSpouseBirthDate(dto.getSpouseBirthDate());
        application.setSpouseFatherName(dto.getSpouseFatherName());
        application.setSpouseMotherName(dto.getSpouseMotherName());
        
        // Workplace
        application.setWorkplace(dto.getWorkplace());
        application.setPosition(dto.getPosition());
        application.setWorkAddress(dto.getWorkAddress());
        application.setWorkPhone(dto.getWorkPhone());
        
        // Additional Information
        application.setAdditionalInformation(dto.getAdditionalInformation());
        application.setAcceptsTerms(dto.getAcceptsTerms());

        // Dependents
        if (dto.getDependents() != null && !dto.getDependents().isEmpty()) {
            List<ApplicationDependent> dependents = dto.getDependents().stream()
                    .map(depDto -> {
                        ApplicationDependent dep = new ApplicationDependent();
                        dep.setApplication(application);
                        dep.setName(depDto.getName());
                        dep.setRelationship(depDto.getRelationship());
                        dep.setProfession(depDto.getProfession());
                        dep.setAge(depDto.getAge());
                        return dep;
                    })
                    .collect(Collectors.toList());
            application.setDependents(dependents);
        }
        
        return application;
    }
}
