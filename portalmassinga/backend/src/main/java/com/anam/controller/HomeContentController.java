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
import java.util.Map;
import java.util.Optional;
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

    /**
     * Endpoint para inicializar conteúdo padrão da página inicial
     * Este endpoint garante que todo o conteúdo atual está salvo na base de dados
     * Se já existir, atualiza; se não existir, cria
     */
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeDefaultContent() {
        System.out.println("========================================");
        System.out.println("🚀 POST /home-content/initialize - Inicializando conteúdo padrão");
        
        try {
            int created = 0;
            int updated = 0;
            
            // Slide 1: Bem-vindo
            created += initializeOrUpdateContent("hero_slide_1",
                "Bem-vindo à <span class='highlight-letter-yellow'>Associação</span> de Naturais e Amigos de Massinga",
                "Unindo pessoas, fortalecendo comunidades, construindo o futuro de Massinga.",
                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                0,
                "{\"buttonText\": \"Torne-se Membro\", \"buttonLink\": \"/associar\", \"buttonColor\": \"#FFD700\"}");
            
            // Slide 2: Missão
            created += initializeOrUpdateContent("hero_slide_2",
                "Nossa <span class='highlight-letter-red'>Missão</span>",
                "Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.",
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                1,
                "{\"buttonText\": \"Torne-se Simpatizante\", \"buttonLink\": \"/associar\", \"buttonColor\": \"#EF4444\"}");
            
            // Slide 3: Visão
            created += initializeOrUpdateContent("hero_slide_3",
                "Nossa <span class='highlight-letter-yellow'>Visão</span>",
                "Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.",
                "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                2,
                "{\"buttonText\": \"Torne-se Apoiante\", \"buttonLink\": \"/associar\", \"buttonColor\": \"#60A5FA\"}");
            
            // Slide 4: Valores
            created += initializeOrUpdateContent("hero_slide_4",
                "Nossos <span class='highlight-letter-red'>Valores</span>",
                "<strong class='highlight-letter-yellow'>Desenvolvimento de Competências:</strong> Força de trabalho qualificada e programas de capacitação.<br><br><strong class='highlight-letter-yellow'>Networking Empresarial:</strong> Conexão com profissionais de alto nível e tomadores de decisão.<br><br><strong class='highlight-letter-yellow'>Oportunidades em Tempo Real:</strong> Projetos em mineração, energia, agricultura e infraestrutura.",
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                3,
                "{\"buttonText\": \"Torne-se Parceiro\", \"buttonLink\": \"/parceiros\", \"buttonColor\": \"#4CAF50\"}");
            
            // Sobre ANAM
            created += initializeOrUpdateContent("sobre_anam",
                "Sobre a ANAM",
                "Promovemos o desenvolvimento sustentável e o bem-estar socioeconómico das comunidades do Distrito de Massinga.",
                null,
                10,
                null);
            
            // Missão
            created += initializeOrUpdateContent("missao",
                "Missão",
                "Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.",
                null,
                11,
                null);
            
            // Visão
            created += initializeOrUpdateContent("visao",
                "Visão",
                "Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.",
                null,
                12,
                null);
            
            // Valores
            created += initializeOrUpdateContent("valores",
                "Nossos Valores",
                null,
                null,
                13,
                "{\"valores\": [{\"titulo\": \"Desenvolvimento de Competências\", \"descricao\": \"Acesse uma força de trabalho qualificada, identifique programas de capacitação e gerencie necessidades de capital humano.\"}, {\"titulo\": \"Networking Empresarial\", \"descricao\": \"Conecte-se com profissionais de alto nível, tomadores de decisão e agentes-chave em múltiplos setores.\"}, {\"titulo\": \"Oportunidades em Tempo Real\", \"descricao\": \"Participe de projetos nos setores de mineração, energia, agricultura e infraestrutura com dados transparentes e em tempo real.\"}]}");
            
            // Configurações de Natal
            created += initializeOrUpdateContent("christmas_config",
                null,
                null,
                null,
                0,
                "{\"enableSnow\": true, \"enableSanta\": true, \"christmasMessage\": \"Feliz Natal e Próspero 2025 🎄\"}");
            
            System.out.println("   ✅ Conteúdo inicializado: " + created + " criados/atualizados");
            System.out.println("========================================");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Conteúdo padrão inicializado com sucesso",
                "itemsProcessed", created
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Erro ao inicializar conteúdo: " + e.getMessage()
                    ));
        }
    }
    
    /**
     * Método auxiliar para inicializar ou atualizar conteúdo
     * Retorna 1 se criou, 0 se atualizou
     */
    private int initializeOrUpdateContent(String sectionKey, String title, String subtitle, 
                                         String imageUrl, Integer orderIndex, String metadata) {
        Optional<HomeContent> existing = repository.findBySectionKey(sectionKey);
        
        HomeContent content;
        boolean isNew = existing.isEmpty();
        
        if (isNew) {
            content = new HomeContent();
            content.setSectionKey(sectionKey);
        } else {
            content = existing.get();
        }
        
        if (title != null) content.setTitle(title);
        if (subtitle != null) content.setSubtitle(subtitle);
        if (imageUrl != null) content.setImageUrl(imageUrl);
        if (orderIndex != null) content.setOrderIndex(orderIndex);
        if (metadata != null) content.setMetadata(metadata);
        content.setIsActive(true);
        
        repository.save(content);
        return isNew ? 1 : 0;
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

