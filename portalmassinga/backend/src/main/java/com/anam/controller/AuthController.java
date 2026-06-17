package com.anam.controller;

import com.anam.entity.Membro;
import com.anam.entity.User;
import com.anam.repository.MembroRepository;
import com.anam.repository.UserRepository;
import com.anam.service.QuotaService;
import com.anam.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembroRepository membroRepository;

    @Autowired
    private QuotaService quotaService;

    @Autowired
    private SmsService smsService;

    /**
     * Login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Validação básica
        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Email e senha são obrigatórios"));
        }

        // Contas de teste para desenvolvimento
        Map<String, Map<String, Object>> contasTeste = new HashMap<>();
        
        // Conta 1: Guilherme
        Map<String, Object> guilherme = new HashMap<>();
        guilherme.put("email", "guilherme@gmail.com");
        guilherme.put("nome", "Guilherme Silva");
        guilherme.put("role", "membro");
        guilherme.put("memberId", null);
        contasTeste.put("guilherme@gmail.com", guilherme);

        // Conta 2: Elber
        Map<String, Object> elber = new HashMap<>();
        elber.put("email", "elber@gmail.com");
        elber.put("nome", "Elber Cumbane");
        elber.put("role", "membro");
        elber.put("memberId", null);
        contasTeste.put("elber@gmail.com", elber);

        // Conta 3: Marta
        Map<String, Object> marta = new HashMap<>();
        marta.put("email", "martasozinh@gmail.com");
        marta.put("nome", "Marta Fabiano dos Anjos Sozinho");
        marta.put("role", "membro");
        marta.put("memberId", null);
        contasTeste.put("martasozinh@gmail.com", marta);

        // Conta Admin para dashboard
        Map<String, Object> admin = new HashMap<>();
        admin.put("email", "admin@anam.com");
        admin.put("nome", "Administrador");
        admin.put("role", "admin");
        admin.put("memberId", null);
        contasTeste.put("admin@anam.com", admin);

        // Verificar credenciais
        String emailLower = email.toLowerCase().trim();
        
        // Primeiro, verificar contas de teste (para desenvolvimento)
        if (contasTeste.containsKey(emailLower) && "123456".equals(password)) {
            Map<String, Object> user = contasTeste.get(emailLower);
            
            // Gerar token simples (em produção, usar JWT)
            String token = "token_" + System.currentTimeMillis() + "_" + emailLower.hashCode();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("user", user);
            response.put("message", "Login realizado com sucesso");
            
            return ResponseEntity.ok(response);
        }
        
        // Verificar usuário no banco de dados
        Optional<User> userOpt = userRepository.findByEmail(emailLower);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Verificar senha (em produção, usar BCrypt)
            if (!user.getSenha().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Email ou senha inválidos"));
            }
            
            // Verificar se usuário está ativo
            if (!user.getAtivo()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "message", "Conta desativada. Entre em contato com o administrador."));
            }
            
            // Verificar se membro está aprovado
            Optional<Membro> membroOpt = membroRepository.findById(user.getMembroId());
            if (membroOpt.isPresent()) {
                Membro membro = membroOpt.get();
                
                if (!"Aprovado".equals(membro.getStatus())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("success", false, "message", "Sua candidatura ainda não foi aprovada. Aguarde a aprovação."));
                }
                
                // Verificar cotas vencidas
                boolean temAcesso = quotaService.membroTemAcesso(user.getMembroId());
                if (!temAcesso) {
                    // Enviar SMS de bloqueio (opcional - pode ser enviado apenas uma vez por dia)
                    try {
                        smsService.sendQuotaBlockedSms(membro.getCelular(), membro.getNomeCompleto());
                        logger.info("SMS de bloqueio enviado para: {}", membro.getCelular());
                    } catch (Exception e) {
                        logger.error("Erro ao enviar SMS de bloqueio: {}", e.getMessage());
                    }
                    
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of(
                                "success", false, 
                                "message", "Acesso bloqueado devido ao não pagamento de cotas. Por favor, efetue o pagamento para reativar seu acesso.",
                                "blocked", true
                            ));
                }
            }
            
            // Atualizar último login
            user.setLastLogin(java.time.LocalDateTime.now());
            userRepository.save(user);
            
            // Buscar dados do membro
            Optional<Membro> membroOpt2 = membroRepository.findById(user.getMembroId());
            String nome = membroOpt2.map(Membro::getNomeCompleto).orElse("Membro");
            
            // Gerar token
            String token = "token_" + System.currentTimeMillis() + "_" + emailLower.hashCode();
            
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("email", user.getEmail());
            userResponse.put("nome", nome);
            userResponse.put("role", user.getRole());
            userResponse.put("memberId", user.getMembroId().toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("user", userResponse);
            response.put("message", "Login realizado com sucesso");
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Email ou senha inválidos"));
    }

    /**
     * Get current user
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Em produção, validar o token JWT aqui
        // Por enquanto, retornar sucesso se houver token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token válido");
            
            // Tentar extrair email do token (mockado)
            String token = authHeader.substring(7);
            if (token.contains("admin")) {
                Map<String, Object> user = new HashMap<>();
                user.put("email", "admin@anam.com");
                user.put("nome", "Administrador");
                user.put("role", "admin");
                response.put("user", user);
            }
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Token não fornecido"));
    }
}
