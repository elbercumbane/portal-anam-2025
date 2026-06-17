package com.anam.controller;

import com.anam.dto.ApoianteDTO;
import com.anam.entity.Apoiante;
import com.anam.repository.ApoianteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/apoiantes")
@CrossOrigin(origins = "*")
public class ApoianteController {

    @Autowired
    private ApoianteRepository apoianteRepository;

    /**
     * Criar novo apoiante
     * POST /api/apoiantes
     */
    @PostMapping
    public ResponseEntity<?> criarApoiante(@Valid @RequestBody ApoianteDTO dto) {
        try {
            // Verificar se o email já existe
            if (apoianteRepository.existsByEmail(dto.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Erro: Este email já está cadastrado!");
            }

            // Converter DTO para Entity
            Apoiante apoiante = convertToEntity(dto);
            
            // Salvar apoiante na base de dados
            Apoiante apoianteSalvo = apoianteRepository.save(apoiante);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(apoianteSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao cadastrar apoiante: " + e.getMessage());
        }
    }

    /**
     * Listar todos os apoiantes
     * GET /api/apoiantes
     */
    @GetMapping
    public ResponseEntity<List<Apoiante>> listarApoiantes(
            @RequestParam(required = false) String status) {
        try {
            List<Apoiante> apoiantes;
            if (status != null && !status.isEmpty()) {
                apoiantes = apoianteRepository.findByStatus(status);
            } else {
                apoiantes = apoianteRepository.findAll();
            }
            
            if (apoiantes == null) {
                apoiantes = new java.util.ArrayList<>();
            }
            
            return ResponseEntity.ok(apoiantes);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    /**
     * Buscar apoiante por ID
     * GET /api/apoiantes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Apoiante> buscarApoiantePorId(@PathVariable UUID id) {
        return apoianteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar apoiante por email
     * GET /api/apoiantes/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Apoiante> buscarApoiantePorEmail(@PathVariable String email) {
        return apoianteRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Aprovar apoiante
     * PUT /api/apoiantes/{id}/aprovar
     */
    @PutMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovarApoiante(@PathVariable UUID id) {
        return apoianteRepository.findById(id)
                .map(apoiante -> {
                    apoiante.setStatus("Aprovado");
                    apoiante.setDataAprovacao(java.time.LocalDateTime.now());
                    return ResponseEntity.ok(apoianteRepository.save(apoiante));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Rejeitar apoiante
     * PUT /api/apoiantes/{id}/rejeitar
     */
    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitarApoiante(@PathVariable UUID id, 
                                             @RequestBody(required = false) String observacoes) {
        return apoianteRepository.findById(id)
                .map(apoiante -> {
                    apoiante.setStatus("Rejeitado");
                    if (observacoes != null && !observacoes.trim().isEmpty()) {
                        apoiante.setObservacoes(observacoes);
                    }
                    return ResponseEntity.ok(apoianteRepository.save(apoiante));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Converter DTO para Entity
     */
    private Apoiante convertToEntity(ApoianteDTO dto) {
        Apoiante apoiante = new Apoiante();
        
        apoiante.setNomeCompleto(dto.getNomeCompleto());
        apoiante.setEmail(dto.getEmail());
        apoiante.setContacto(dto.getContacto());
        apoiante.setTipoApoio(dto.getTipoApoio());
        apoiante.setDescricao(dto.getDescricao());
        apoiante.setAnonimato(dto.getAnonimato());
        
        return apoiante;
    }
}
