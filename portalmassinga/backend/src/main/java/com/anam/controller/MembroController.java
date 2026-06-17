package com.anam.controller;

import com.anam.dto.MembroDTO;
import com.anam.dto.PdfExtractionResponseDTO;
import com.anam.entity.Membro;
import com.anam.entity.User;
import com.anam.repository.MembroRepository;
import com.anam.repository.UserRepository;
import com.anam.service.PdfExtractionService;
import com.anam.service.SmsService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/membros")
@CrossOrigin(origins = "*")
public class MembroController {

    private static final Logger logger = LoggerFactory.getLogger(MembroController.class);

    @Autowired
    private MembroRepository membroRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PdfExtractionService pdfExtractionService;

    /**
     * Criar novo membro
     * POST /api/membros
     */
    @PostMapping
    public ResponseEntity<?> criarMembro(@Valid @RequestBody MembroDTO dto) {
        try {
            // Verificar se o email já existe
            if (membroRepository.existsByEmail(dto.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Erro: Este email já está cadastrado!");
            }

            // Converter DTO para Entity
            Membro membro = convertToEntity(dto);
            
            // Salvar membro na base de dados
            Membro membroSalvo = membroRepository.save(membro);
            
            // Enviar SMS de notificação de cadastro pendente
            try {
                smsService.sendRegistrationPendingSms(
                    membroSalvo.getCelular(),
                    membroSalvo.getNomeCompleto()
                );
                logger.info("SMS de cadastro pendente enviado para: {}", membroSalvo.getCelular());
            } catch (Exception e) {
                logger.error("Erro ao enviar SMS de cadastro pendente: {}", e.getMessage());
                // Não falhar o cadastro se o SMS falhar
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(membroSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao cadastrar membro: " + e.getMessage());
        }
    }

    /**
     * Upload PDF with member forms for extraction via Claude AI
     * POST /api/membros/upload-pdf
     */
    @PostMapping(value = "/upload-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file provided");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            return ResponseEntity.badRequest().body("File must be a PDF");
        }

        if (file.getSize() > 20L * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds 20MB limit");
        }

        try {
            PdfExtractionResponseDTO result = pdfExtractionService.extractMembersFromPdf(file);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            logger.error("PDF extraction configuration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
        } catch (Exception e) {
            logger.error("PDF extraction failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body("Failed to extract member data from PDF: " + e.getMessage());
        }
    }

    /**
     * Listar todos os membros
     * GET /api/membros
     */
    @GetMapping
    public ResponseEntity<List<Membro>> listarMembros(
            @RequestParam(required = false) String status) {
        try {
            List<Membro> membros;
            if (status != null && !status.isEmpty()) {
                membros = membroRepository.findByStatus(status);
            } else {
                membros = membroRepository.findAll();
            }
            
            if (membros == null) {
                membros = new java.util.ArrayList<>();
            }
            
            return ResponseEntity.ok(membros);
        } catch (Exception e) {
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    /**
     * Buscar membro por ID
     * GET /api/membros/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Membro> buscarMembroPorId(@PathVariable UUID id) {
        return membroRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar membro por email
     * GET /api/membros/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Membro> buscarMembroPorEmail(@PathVariable String email) {
        return membroRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Aprovar membro
     * PUT /api/membros/{id}/aprovar
     */
    @PutMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovarMembro(@PathVariable UUID id, 
                                          @RequestBody(required = false) Map<String, String> requestBody) {
        return membroRepository.findById(id)
                .map(membro -> {
                    membro.setStatus("Aprovado");
                    membro.setDataAprovacao(java.time.LocalDateTime.now());
                    Membro membroAprovado = membroRepository.save(membro);
                    
                    // Gerar senha temporária se não fornecida
                    String senha = requestBody != null && requestBody.containsKey("senha") 
                        ? requestBody.get("senha") 
                        : gerarSenhaTemporaria();
                    
                    // Criar ou atualizar usuário
                    User user = userRepository.findByMembroId(id)
                        .orElse(new User());
                    user.setMembroId(id);
                    user.setEmail(membroAprovado.getEmail().toLowerCase().trim());
                    user.setSenha(senha); // Em produção, usar BCrypt para hash
                    user.setRole("membro");
                    user.setAtivo(true);
                    userRepository.save(user);
                    
                    // Enviar SMS com credenciais
                    try {
                        smsService.sendApprovalCredentialsSms(
                            membroAprovado.getCelular(),
                            membroAprovado.getNomeCompleto(),
                            membroAprovado.getEmail(),
                            senha
                        );
                        logger.info("SMS de aprovação enviado para: {}", membroAprovado.getCelular());
                    } catch (Exception e) {
                        logger.error("Erro ao enviar SMS de aprovação: {}", e.getMessage());
                        // Não falhar a aprovação se o SMS falhar
                    }
                    
                    return ResponseEntity.ok(membroAprovado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Gera uma senha temporária aleatória
     */
    private String gerarSenhaTemporaria() {
        // Gerar senha de 8 caracteres: 4 letras + 4 números
        String letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        String numeros = "23456789";
        StringBuilder senha = new StringBuilder();
        
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 4; i++) {
            senha.append(letras.charAt(random.nextInt(letras.length())));
        }
        for (int i = 0; i < 4; i++) {
            senha.append(numeros.charAt(random.nextInt(numeros.length())));
        }
        
        // Embaralhar
        char[] chars = senha.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        
        return new String(chars);
    }

    /**
     * Rejeitar membro
     * PUT /api/membros/{id}/rejeitar
     */
    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitarMembro(@PathVariable UUID id, 
                                             @RequestBody(required = false) String observacoes) {
        return membroRepository.findById(id)
                .map(membro -> {
                    membro.setStatus("Rejeitado");
                    if (observacoes != null && !observacoes.trim().isEmpty()) {
                        membro.setObservacoes(observacoes);
                    }
                    return ResponseEntity.ok(membroRepository.save(membro));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Converter DTO para Entity
     */
    private Membro convertToEntity(MembroDTO dto) {
        Membro membro = new Membro();
        
        // Dados Pessoais
        membro.setFoto(dto.getFoto());
        membro.setNomeCompleto(dto.getNomeCompleto());
        membro.setNomePai(dto.getNomePai());
        membro.setNomeMae(dto.getNomeMae());
        membro.setDataNascimento(dto.getDataNascimento());
        membro.setEstadoCivil(dto.getEstadoCivil());
        membro.setProfissao(dto.getProfissao());
        
        // Contatos
        membro.setCelular(dto.getCelular());
        membro.setEmail(dto.getEmail());
        membro.setTelefone(dto.getTelefone());
        membro.setRua(dto.getRua());
        membro.setBairro(dto.getBairro());
        membro.setCidade(dto.getCidade());
        
        // Cônjuge
        membro.setNomeConjuge(dto.getNomeConjuge());
        membro.setDataNascimentoConjuge(dto.getDataNascimentoConjuge());
        membro.setFiliacaoPaiConjuge(dto.getFiliacaoPaiConjuge());
        membro.setFiliacaoMaeConjuge(dto.getFiliacaoMaeConjuge());
        
        // Trabalho
        membro.setLocalTrabalho(dto.getLocalTrabalho());
        membro.setCargo(dto.getCargo());
        membro.setEnderecoTrabalho(dto.getEnderecoTrabalho());
        membro.setTelefoneTrabalho(dto.getTelefoneTrabalho());
        
        // Outras Informações
        membro.setOutrasInformacoes(dto.getOutrasInformacoes());
        membro.setAceitaTermos(dto.getAceitaTermos());
        
        return membro;
    }
}
