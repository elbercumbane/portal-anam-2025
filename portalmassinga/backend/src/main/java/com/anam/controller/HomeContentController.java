package com.anam.controller;

import com.anam.dto.HomeContentDTO;
import com.anam.entity.HomeContent;
import com.anam.repository.HomeContentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
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
    
    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

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
            
            // ESTATÍSTICAS (Stats)
            created += initializeOrUpdateContent("stats_item_1",
                "200+",
                "Membros e não Membros Activos",
                null,
                20,
                "{\"icon\": \"people\", \"color\": \"#60A5FA\", \"bgColor\": \"#60A5FA15\", \"borderColor\": \"#60A5FA30\"}");
            
            created += initializeOrUpdateContent("stats_item_2",
                "50+",
                "Projectos Realizados",
                null,
                21,
                "{\"icon\": \"assignment\", \"color\": \"#4CAF50\", \"bgColor\": \"#4CAF5015\", \"borderColor\": \"#4CAF5030\"}");
            
            created += initializeOrUpdateContent("stats_item_3",
                "12",
                "Províncias Representadas",
                null,
                22,
                "{\"icon\": \"location_on\", \"color\": \"#60A5FA\", \"bgColor\": \"#60A5FA15\", \"borderColor\": \"#60A5FA30\"}");
            
            created += initializeOrUpdateContent("stats_item_4",
                "25+",
                "Parceiros Estratégicos",
                null,
                23,
                "{\"icon\": \"handshake\", \"color\": \"#4CAF50\", \"bgColor\": \"#4CAF5015\", \"borderColor\": \"#4CAF5030\"}");
            
            // EVENTOS (Events)
            created += initializeOrUpdateContent("event_1",
                "Feira de Produtos Locais",
                "Exposição e venda de produtos artesanais e agrícolas da região.",
                "/assets/mercado-maputo.jpg",
                30,
                "{\"data\": \"22 de Março, 2024\", \"local\": \"Praça Central de Massinga\", \"hora\": \"08:00 - 18:00\", \"eventoId\": \"2\"}");
            
            created += initializeOrUpdateContent("event_2",
                "Conferência de Desenvolvimento Comunitário",
                "Discussão sobre estratégias de desenvolvimento sustentável para a comunidade.",
                "/assets/desenvolvimento-comunitario.jpg",
                31,
                "{\"data\": \"29 de Março, 2024\", \"local\": \"Auditório Municipal\", \"hora\": \"14:00 - 18:00\", \"eventoId\": \"3\"}");
            
            created += initializeOrUpdateContent("event_3",
                "Seminário de Capacitação Empresarial",
                "Capacitação em gestão empresarial, marketing digital e finanças para pequenos negócios.",
                "/assets/slider/slide1.jpg",
                32,
                "{\"data\": \"5 de Abril, 2024\", \"local\": \"Centro de Formação Profissional\", \"hora\": \"09:00 - 16:00\", \"eventoId\": \"4\"}");
            
            // NOTÍCIAS (News)
            created += initializeOrUpdateContent("news_item_1",
                "Nova Parceria com Empresas Locais",
                "A ANAM estabeleceu uma nova parceria estratégica com empresas locais para promover o desenvolvimento económico da região.",
                "/assets/slider/slide1.jpg",
                40,
                "{\"data\": \"15 de Janeiro, 2025\", \"categoria\": \"Parcerias\", \"excerpt\": \"A ANAM estabeleceu uma nova parceria estratégica com empresas locais para promover o desenvolvimento económico da região.\", \"link\": \"/noticias/1\"}");
            
            created += initializeOrUpdateContent("news_item_2",
                "Workshop de Capacitação Realizado com Sucesso",
                "Mais de 50 participantes beneficiaram do workshop de capacitação em gestão empresarial realizado no mês passado.",
                "/assets/slider/slide2.jpg",
                41,
                "{\"data\": \"10 de Janeiro, 2025\", \"categoria\": \"Eventos\", \"excerpt\": \"Mais de 50 participantes beneficiaram do workshop de capacitação em gestão empresarial realizado no mês passado.\", \"link\": \"/noticias/2\"}");
            
            created += initializeOrUpdateContent("news_item_3",
                "Projeto de Desenvolvimento Comunitário Iniciado",
                "Iniciámos um novo projeto focado no desenvolvimento sustentável das comunidades rurais do distrito de Massinga.",
                "/assets/slider/slide3.jpg",
                42,
                "{\"data\": \"5 de Janeiro, 2025\", \"categoria\": \"Projetos\", \"excerpt\": \"Iniciámos um novo projeto focado no desenvolvimento sustentável das comunidades rurais do distrito de Massinga.\", \"link\": \"/noticias/3\"}");
            
            // GALERIA (Gallery) - Primeiros 4 eventos
            created += initializeOrUpdateContent("gallery_event_1",
                "Feira de Produtos Locais",
                "Uma feira vibrante onde produtores locais apresentam e vendem os seus produtos frescos. A comunidade reúne-se para apoiar a economia local e celebrar a riqueza dos produtos da nossa terra.",
                "/assets/slider/slide1.jpg",
                50,
                "{\"data\": \"30 de Janeiro, 2024\", \"local\": \"Praça Central de Massinga\", \"categoria\": \"Feira\", \"participantes\": 150, \"fotos\": [{\"src\": \"/assets/slider/slide1.jpg\", \"alt\": \"Feira de Produtos - Vista Geral da Praça\"}, {\"src\": \"/assets/slider/slide2.jpg\", \"alt\": \"Feira de Produtos - Produtores Locais\"}, {\"src\": \"/assets/slider/slide3.jpg\", \"alt\": \"Feira de Produtos - Produtos Frescos\"}]}");
            
            created += initializeOrUpdateContent("gallery_event_2",
                "Workshop de Agricultura Sustentável",
                "Sessão prática de capacitação onde agricultores aprendem técnicas modernas e sustentáveis para aumentar a produtividade das suas culturas, promovendo uma agricultura mais eficiente e amiga do ambiente.",
                "/assets/slider/slide2.jpg",
                51,
                "{\"data\": \"15 de Janeiro, 2024\", \"local\": \"Centro Comunitário de Massinga\", \"categoria\": \"Workshop\", \"participantes\": 45, \"fotos\": [{\"src\": \"/assets/slider/slide2.jpg\", \"alt\": \"Workshop - Início da Sessão\"}, {\"src\": \"/assets/slider/slide3.jpg\", \"alt\": \"Workshop - Demonstração Prática\"}, {\"src\": \"/assets/slider/slide1.jpg\", \"alt\": \"Workshop - Participantes Atentos\"}]}");
            
            created += initializeOrUpdateContent("gallery_event_3",
                "Encontro Mensal da Associação",
                "Reunião estratégica onde membros da associação discutem projetos em curso, planos futuros e desafios da comunidade, fortalecendo a união e o compromisso coletivo.",
                "/assets/galeria/encontro1.jpg",
                52,
                "{\"data\": \"20 de Janeiro, 2024\", \"local\": \"Sede da Associação\", \"categoria\": \"Reunião\", \"participantes\": 25, \"fotos\": [{\"src\": \"/assets/galeria/encontro1.jpg\", \"alt\": \"Encontro - Reunião de Membros\"}, {\"src\": \"/assets/galeria/encontro2.jpg\", \"alt\": \"Encontro - Discussão de Projetos\"}, {\"src\": \"/assets/galeria/encontro3.jpg\", \"alt\": \"Encontro - Membros Participativos\"}]}");
            
            created += initializeOrUpdateContent("gallery_event_4",
                "Festival Cultural",
                "Celebração da cultura local com música, dança e gastronomia tradicional, unindo a comunidade em uma festa memorável.",
                "/assets/galeria/festival1.jpg",
                53,
                "{\"data\": \"10 de Fevereiro, 2024\", \"local\": \"Praça Central de Massinga\", \"categoria\": \"Cultural\", \"participantes\": 300, \"fotos\": [{\"src\": \"/assets/galeria/festival1.jpg\", \"alt\": \"Festival - Apresentação Cultural\"}, {\"src\": \"/assets/galeria/festival2.jpg\", \"alt\": \"Festival - Dança Tradicional\"}, {\"src\": \"/assets/galeria/festival3.jpg\", \"alt\": \"Festival - Música ao Vivo\"}, {\"src\": \"/assets/galeria/festival4.jpg\", \"alt\": \"Festival - Gastronomia\"}]}");
            
            // PARCEIROS (Partners) - Seção na home (apenas imagens)
            created += initializeOrUpdateContent("partners_section",
                "Nossos Parceiros",
                "Organizações que acreditam na nossa missão",
                null,
                60,
                "{\"images\": [\"/assets/parceiros.png\", \"/assets/parceiros2.png\"]}");
            
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

    /**
     * Endpoint para migrar a coluna image_url de VARCHAR(500) para TEXT
     * Execute este endpoint uma vez para corrigir o erro 400 ao salvar imagens grandes
     */
    @PostMapping("/migrate-image-url")
    public ResponseEntity<?> migrateImageUrlColumn() {
        System.out.println("========================================");
        System.out.println("🔧 POST /home-content/migrate-image-url - Migrando coluna image_url");
        
        if (jdbcTemplate == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "JdbcTemplate não disponível"
                    ));
        }
        
        try {
            // Verificar o tipo atual da coluna
            String checkColumnQuery = 
                "SELECT data_type, character_maximum_length " +
                "FROM information_schema.columns " +
                "WHERE table_name = 'home_content' AND column_name = 'image_url'";
            
            List<Map<String, Object>> columnInfo = jdbcTemplate.queryForList(checkColumnQuery);
            
            if (columnInfo.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                            "success", false,
                            "message", "Coluna image_url não encontrada na tabela home_content"
                        ));
            }
            
            Map<String, Object> column = columnInfo.get(0);
            String dataType = (String) column.get("data_type");
            Object maxLength = column.get("character_maximum_length");
            
            System.out.println("   Tipo atual: " + dataType);
            System.out.println("   Tamanho máximo: " + maxLength);
            
            // Se já for TEXT, não precisa migrar
            if ("text".equalsIgnoreCase(dataType) || maxLength == null) {
                System.out.println("   ✅ Coluna já é TEXT, não precisa migrar");
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Coluna image_url já é TEXT, não precisa migrar",
                    "currentType", dataType
                ));
            }
            
            // Executar migração
            System.out.println("   🔄 Alterando coluna de VARCHAR para TEXT...");
            jdbcTemplate.execute("ALTER TABLE home_content ALTER COLUMN image_url TYPE TEXT");
            
            // Verificar novamente
            List<Map<String, Object>> updatedColumnInfo = jdbcTemplate.queryForList(checkColumnQuery);
            Map<String, Object> updatedColumn = updatedColumnInfo.get(0);
            String updatedDataType = (String) updatedColumn.get("data_type");
            
            System.out.println("   ✅ Migração concluída! Novo tipo: " + updatedDataType);
            System.out.println("========================================");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Coluna image_url migrada com sucesso de VARCHAR para TEXT",
                "previousType", dataType,
                "newType", updatedDataType
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("   ❌ Erro na migração: " + e.getMessage());
            System.out.println("========================================");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Erro ao migrar coluna: " + e.getMessage()
                    ));
        }
    }
}

