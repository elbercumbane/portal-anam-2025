package com.anam.controller;

import com.anam.entity.MemberApplication;
import com.anam.entity.User;
import com.anam.repository.MemberApplicationRepository;
import com.anam.repository.QuotaPaymentRepository;
import com.anam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final BigDecimal VALOR_COTA_MENSAL = new BigDecimal("1200");
    private static final Map<String, UUID> tokenToUserId = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberApplicationRepository memberRepository;

    @Autowired
    private QuotaPaymentRepository quotaPaymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Login: email + senha
     * Retorna token (UUID simples) e dados do utilizador.
     * Para membros: verifica cotas em falta e bloqueia se tiver dívidas (excepto admin).
     * Para admin: alerta sobre cotas mas permite acesso.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String emailOrNuit = body != null ? (body.get("emailOrNuit") != null ? body.get("emailOrNuit") : body.get("email")) : null;
        String password = body != null ? body.get("password") : null;

        if (emailOrNuit == null || emailOrNuit.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email/NUIT e senha são obrigatórios"
            ));
        }

        String input = emailOrNuit.trim();
        Optional<User> optUser;
        if (input.matches("\\d+")) {
            // NUIT: apenas dígitos - buscar membro por NUIT e obter User associado
            optUser = memberRepository.findByNuitIgnoreCase(input)
                    .filter(m -> "Approved".equals(m.getStatus()))
                    .flatMap(m -> userRepository.findByMemberApplicationId(m.getId()));
        } else {
            // Email
            optUser = userRepository.findByEmailIgnoreCase(input);
        }
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email ou senha incorretos"
            ));
        }

        User user = optUser.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email ou senha incorretos"
            ));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("email", user.getEmail());
        userData.put("nome", user.getFullName());
        userData.put("full_name", user.getFullName());
        userData.put("role", user.getRole());
        userData.put("memberId", user.getMemberApplicationId() != null ? user.getMemberApplicationId().toString() : null);
        userData.put("member_id", user.getMemberApplicationId() != null ? user.getMemberApplicationId().toString() : null);
        userData.put("mustChangePassword", user.isMustChangePassword());

        // Verificar cotas em falta (apenas para membros, ou admin que também é membro)
        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole()) || "super-admin".equalsIgnoreCase(user.getRole());
        Map<String, Object> cotasEmFalta = null;

        if (user.getMemberApplicationId() != null) {
            cotasEmFalta = checkCotasEmFalta(user.getMemberApplicationId());
        }

        if (cotasEmFalta != null && !cotasEmFalta.isEmpty()) {
            userData.put("cotasEmFalta", cotasEmFalta);
            // Membro com dívidas: bloquear login (retorna 200 mas success=false para o frontend mostrar modal)
            if (!isAdmin) {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Tem cotas em atraso. Pague para aceder à área de membros.",
                        "user", userData
                ));
            }
            // Admin com dívidas: permitir mas informar
        }

        String token = UUID.randomUUID().toString();
        tokenToUserId.put(token, user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "user", userData
        ));
    }

    /**
     * Alterar senha (obrigatório no primeiro login).
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                            @RequestBody Map<String, String> body) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Token inválido ou em falta"));
        }
        String token = authHeader.substring(7).trim();
        UUID userId = tokenToUserId.get(token);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Token expirado ou inválido"));
        }
        String newPassword = body != null ? body.get("newPassword") : null;
        if (newPassword == null || newPassword.trim().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Nova senha deve ter no mínimo 6 caracteres"));
        }
        return userRepository.findById(userId)
                .map(user -> {
                    user.setPasswordHash(passwordEncoder.encode(newPassword.trim()));
                    user.setMustChangePassword(false);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of("success", true, "message", "Senha alterada com sucesso"));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("success", false, "message", "Utilizador não encontrado")));
    }

    /**
     * Valida token e retorna dados do utilizador.
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Token inválido ou em falta"
            ));
        }
        String token = authHeader.substring(7).trim();
        UUID userId = tokenToUserId.get(token);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Token expirado ou inválido"
            ));
        }
        return userRepository.findById(userId)
                .map(user -> {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("email", user.getEmail());
                    userData.put("nome", user.getFullName());
                    userData.put("full_name", user.getFullName());
                    userData.put("role", user.getRole());
                    userData.put("memberId", user.getMemberApplicationId() != null ? user.getMemberApplicationId().toString() : null);
                    userData.put("member_id", user.getMemberApplicationId() != null ? user.getMemberApplicationId().toString() : null);
                    userData.put("mustChangePassword", user.isMustChangePassword());
                    return ResponseEntity.ok(Map.of("success", true, "user", userData));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("success", false, "message", "Utilizador não encontrado")));
    }

    private Map<String, Object> checkCotasEmFalta(UUID memberApplicationId) {
        Optional<MemberApplication> optApp = memberRepository.findById(memberApplicationId);
        if (optApp.isEmpty()) return null;
        MemberApplication m = optApp.get();
        if (!"Approved".equals(m.getStatus())) return null;

        LocalDateTime approvedAt = m.getApprovedAt();
        LocalDateTime refDate = approvedAt != null ? approvedAt : m.getCreatedAt();
        int startYear = refDate.getYear();
        int startMonth = refDate.getMonthValue();

        List<com.anam.entity.QuotaPayment> payments = quotaPaymentRepository.findByMemberApplicationIdOrderByYearDescMonthDesc(memberApplicationId);
        Set<YearMonth> paidMonths = new HashSet<>();
        for (com.anam.entity.QuotaPayment p : payments) {
            if ("Paid".equalsIgnoreCase(p.getStatus())) {
                paidMonths.add(YearMonth.of(p.getYear(), p.getMonth()));
            }
        }

        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();
        int mesesEmDivida = 0;
        YearMonth current = YearMonth.of(currentYear, currentMonth);
        YearMonth start = YearMonth.of(startYear, startMonth);
        for (YearMonth ym = start; !ym.isAfter(current); ym = ym.plusMonths(1)) {
            if (!paidMonths.contains(ym)) mesesEmDivida++;
        }

        if (mesesEmDivida <= 0) return null;

        BigDecimal valorTotal = VALOR_COTA_MENSAL.multiply(BigDecimal.valueOf(mesesEmDivida));
        return Map.of(
                "meses", mesesEmDivida,
                "dataVencimento", String.format("%d-%02d-01", currentYear, currentMonth),
                "valorTotal", valorTotal
        );
    }
}
