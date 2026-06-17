package com.anam.controller;

import com.anam.dto.SimpatizanteDTO;
import com.anam.entity.Simpatizante;
import com.anam.repository.SimpatizanteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/simpatizantes")
@CrossOrigin(origins = "*")
public class SimpatizanteController {

    @Autowired
    private SimpatizanteRepository simpatizanteRepository;

    /**
     * Criar novo simpatizante
     * POST /api/simpatizantes
     */
    @PostMapping
    public ResponseEntity<?> criarSimpatizante(@Valid @RequestBody SimpatizanteDTO dto) {
        try {
            // Verificar se o email já existe
            if (simpatizanteRepository.existsByEmail(dto.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Erro: Este email já está cadastrado!");
            }

            // Converter DTO para Entity
            Simpatizante simpatizante = convertToEntity(dto);
            
            // Salvar simpatizante na base de dados
            Simpatizante simpatizanteSalvo = simpatizanteRepository.save(simpatizante);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(simpatizanteSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao cadastrar simpatizante: " + e.getMessage());
        }
    }

    /**
     * Listar todos os simpatizantes
     * GET /api/simpatizantes
     */
    @GetMapping
    public ResponseEntity<List<Simpatizante>> listarSimpatizantes(
            @RequestParam(required = false) String status) {
        try {
            List<Simpatizante> simpatizantes;
            if (status != null && !status.isEmpty()) {
                simpatizantes = simpatizanteRepository.findByStatus(status);
            } else {
                simpatizantes = simpatizanteRepository.findAll();
            }
            
            if (simpatizantes == null) {
                simpatizantes = new java.util.ArrayList<>();
            }
            
            return ResponseEntity.ok(simpatizantes);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    /**
     * Buscar simpatizante por ID
     * GET /api/simpatizantes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Simpatizante> buscarSimpatizantePorId(@PathVariable UUID id) {
        return simpatizanteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar simpatizante por email
     * GET /api/simpatizantes/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Simpatizante> buscarSimpatizantePorEmail(@PathVariable String email) {
        return simpatizanteRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Ativar simpatizante
     * PUT /api/simpatizantes/{id}/ativar
     */
    @PutMapping("/{id}/ativar")
    public ResponseEntity<?> ativarSimpatizante(@PathVariable UUID id) {
        return simpatizanteRepository.findById(id)
                .map(simpatizante -> {
                    simpatizante.setStatus("Ativo");
                    return ResponseEntity.ok(simpatizanteRepository.save(simpatizante));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Desativar simpatizante
     * PUT /api/simpatizantes/{id}/desativar
     */
    @PutMapping("/{id}/desativar")
    public ResponseEntity<?> desativarSimpatizante(@PathVariable UUID id) {
        return simpatizanteRepository.findById(id)
                .map(simpatizante -> {
                    simpatizante.setStatus("Inativo");
                    return ResponseEntity.ok(simpatizanteRepository.save(simpatizante));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Converter DTO para Entity
     */
    private Simpatizante convertToEntity(SimpatizanteDTO dto) {
        Simpatizante simpatizante = new Simpatizante();
        
        simpatizante.setNomeCompleto(dto.getNomeCompleto());
        simpatizante.setEmail(dto.getEmail());
        simpatizante.setTelefone(dto.getTelefone());
        simpatizante.setConsentimento(dto.getConsentimento());
        
        return simpatizante;
    }
}
