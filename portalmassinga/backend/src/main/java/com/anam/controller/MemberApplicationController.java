package com.anam.controller;

import com.anam.dto.MemberApplicationDTO;
import com.anam.dto.RejectApplicationDTO;
import com.anam.entity.ApplicationDependent;
import com.anam.entity.MemberApplication;
import com.anam.repository.MemberApplicationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/member-applications")
@CrossOrigin(origins = "*")
public class MemberApplicationController {

    @Autowired
    private MemberApplicationRepository repository;

    @PostMapping
    public ResponseEntity<?> createApplication(@Valid @RequestBody MemberApplicationDTO dto) {
        try {
            // Converter DTO para Entity
            MemberApplication application = convertToEntity(dto);
            
            // Salvar candidatura
            MemberApplication saved = repository.save(application);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao criar candidatura: " + e.getMessage());
        }
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

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable UUID id) {
        return repository.findById(id)
                .map(application -> {
                    application.setStatus("Approved");
                    application.setApprovedAt(java.time.LocalDateTime.now());
                    return ResponseEntity.ok(repository.save(application));
                })
                .orElse(ResponseEntity.notFound().build());
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
