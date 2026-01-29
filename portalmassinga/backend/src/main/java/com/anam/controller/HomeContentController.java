package com.anam.controller;

import com.anam.dto.HomeContentDTO;
import com.anam.entity.HomeContent;
import com.anam.repository.HomeContentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/home-content")
@CrossOrigin(origins = "*")
public class HomeContentController {

    @Autowired
    private HomeContentRepository repository;

    @GetMapping
    public ResponseEntity<?> getAllContent(
            @RequestParam(required = false) Boolean activeOnly) {
        System.out.println("========================================");
        System.out.println("📋 GET /home-content - Endpoint chamado");
        System.out.println("   activeOnly: " + activeOnly);
        try {
            List<HomeContent> contents;
            if (activeOnly != null && activeOnly) {
                contents = repository.findByIsActiveTrueOrderByOrderIndexAsc();
            } else {
                contents = repository.findAllByOrderByOrderIndexAsc();
            }
            
            List<HomeContentDTO> dtos = contents.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            System.out.println("   ✅ Retornando " + dtos.size() + " conteúdo(s)");
            System.out.println("========================================");
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar conteúdo: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HomeContentDTO> getContentById(@PathVariable UUID id) {
        return repository.findById(id)
                .map(content -> ResponseEntity.ok(convertToDTO(content)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/section/{sectionKey}")
    public ResponseEntity<HomeContentDTO> getContentBySectionKey(@PathVariable String sectionKey) {
        return repository.findBySectionKey(sectionKey)
                .map(content -> ResponseEntity.ok(convertToDTO(content)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createContent(@Valid @RequestBody HomeContentDTO dto) {
        System.out.println("========================================");
        System.out.println("📝 POST /home-content - Criando conteúdo");
        System.out.println("   sectionKey: " + dto.getSectionKey());
        try {
            // Verificar se já existe conteúdo com a mesma sectionKey
            if (dto.getSectionKey() != null && repository.findBySectionKey(dto.getSectionKey()).isPresent()) {
                System.out.println("   ⚠️ Conflito: sectionKey já existe");
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Já existe conteúdo com a chave: " + dto.getSectionKey());
            }
            
            HomeContent content = convertToEntity(dto);
            HomeContent saved = repository.save(content);
            System.out.println("   ✅ Conteúdo criado com ID: " + saved.getId());
            System.out.println("========================================");
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro de acesso à base de dados. Verifique se a tabela 'home_content' existe. Execute o script: backend/sql/create-table-home-content.sql. Erro: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao criar: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContent(@PathVariable UUID id, @Valid @RequestBody HomeContentDTO dto) {
        try {
            return repository.findById(id)
                    .map(existing -> {
                        // Verificar se sectionKey está sendo alterado e se já existe
                        if (dto.getSectionKey() != null && !dto.getSectionKey().equals(existing.getSectionKey())) {
                            if (repository.findBySectionKey(dto.getSectionKey()).isPresent()) {
                                return ResponseEntity.status(HttpStatus.CONFLICT)
                                        .body("Já existe conteúdo com a chave: " + dto.getSectionKey());
                            }
                        }
                        
                        updateEntityFromDTO(existing, dto);
                        HomeContent updated = repository.save(existing);
                        return ResponseEntity.ok(convertToDTO(updated));
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Conteúdo não encontrado com ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao atualizar: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/sections/{prefix}")
    public ResponseEntity<List<HomeContentDTO>> getContentByPrefix(@PathVariable String prefix) {
        List<HomeContent> contents = repository.findBySectionKeyStartingWith(prefix);
        List<HomeContentDTO> dtos = contents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private HomeContentDTO convertToDTO(HomeContent content) {
        HomeContentDTO dto = new HomeContentDTO();
        dto.setId(content.getId());
        dto.setSectionKey(content.getSectionKey());
        dto.setTitle(content.getTitle());
        dto.setSubtitle(content.getSubtitle());
        dto.setContent(content.getContent());
        dto.setImageUrl(content.getImageUrl());
        dto.setOrderIndex(content.getOrderIndex());
        dto.setIsActive(content.getIsActive());
        dto.setMetadata(content.getMetadata());
        return dto;
    }

    private HomeContent convertToEntity(HomeContentDTO dto) {
        HomeContent content = new HomeContent();
        content.setSectionKey(dto.getSectionKey());
        content.setTitle(dto.getTitle());
        content.setSubtitle(dto.getSubtitle());
        content.setContent(dto.getContent());
        content.setImageUrl(dto.getImageUrl());
        content.setOrderIndex(dto.getOrderIndex());
        content.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        content.setMetadata(dto.getMetadata());
        return content;
    }

    private void updateEntityFromDTO(HomeContent entity, HomeContentDTO dto) {
        if (dto.getSectionKey() != null) {
            entity.setSectionKey(dto.getSectionKey());
        }
        if (dto.getTitle() != null) {
            entity.setTitle(dto.getTitle());
        }
        if (dto.getSubtitle() != null) {
            entity.setSubtitle(dto.getSubtitle());
        }
        if (dto.getContent() != null) {
            entity.setContent(dto.getContent());
        }
        if (dto.getImageUrl() != null) {
            entity.setImageUrl(dto.getImageUrl());
        }
        if (dto.getOrderIndex() != null) {
            entity.setOrderIndex(dto.getOrderIndex());
        }
        if (dto.getIsActive() != null) {
            entity.setIsActive(dto.getIsActive());
        }
        if (dto.getMetadata() != null) {
            entity.setMetadata(dto.getMetadata());
        }
    }
}

