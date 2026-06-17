package com.anam.controller;

import com.anam.dto.CreateUserDTO;
import com.anam.dto.UpdateUserDTO;
import com.anam.entity.User;
import com.anam.repository.MemberApplicationRepository;
import com.anam.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberApplicationRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String getDefaultPassword() {
        return "anam" + java.time.Year.now().getValue();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream()
                .map(this::toResponseMap)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(toResponseMap(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO dto) {
        String defaultPassword = getDefaultPassword();

        if (dto.getNuit() != null && !dto.getNuit().trim().isEmpty()) {
            // Criar user por NUIT (membro) - buscar dados do membro
            return memberRepository.findByNuitIgnoreCase(dto.getNuit().trim())
                    .filter(m -> "Approved".equals(m.getStatus()))
                    .map(member -> {
                        if (userRepository.existsByEmailIgnoreCase(member.getEmail())) {
                            return ResponseEntity.<Map<String, Object>>badRequest()
                                    .body(Map.of("message", "Já existe utilizador com o email deste membro"));
                        }
                        if (userRepository.findByMemberApplicationId(member.getId()).isPresent()) {
                            return ResponseEntity.<Map<String, Object>>badRequest()
                                    .body(Map.of("message", "Este membro já possui conta de acesso"));
                        }
                        User user = new User();
                        user.setEmail(member.getEmail().trim().toLowerCase());
                        user.setFullName(member.getFullName());
                        user.setPasswordHash(passwordEncoder.encode(defaultPassword));
                        user.setRole("membro");
                        user.setMemberApplicationId(member.getId());
                        user.setMustChangePassword(true);
                        User saved = userRepository.save(user);
                        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseMap(saved));
                    })
                    .orElse(ResponseEntity.badRequest().body(Map.of("message", "NUIT não encontrado ou membro não aprovado")));
        }

        // Criar administrador - email e fullName obrigatórios
        String email = dto.getEmail() != null ? dto.getEmail().trim() : "";
        String fullName = dto.getFullName() != null ? dto.getFullName().trim() : "";
        if (email.isEmpty() || fullName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email e nome completo são obrigatórios"));
        }
        if (!email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email inválido"));
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Já existe um utilizador com este email"));
        }
        User user = new User();
        user.setEmail(email.toLowerCase());
        user.setFullName(fullName);
        user.setPasswordHash(passwordEncoder.encode(defaultPassword));
        user.setRole("administrador".equalsIgnoreCase(dto.getRole()) ? "administrador" : "administrador");
        user.setMemberApplicationId(null);
        user.setMustChangePassword(true);
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseMap(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @Valid @RequestBody UpdateUserDTO dto) {
        return userRepository.findById(id)
                .map(existing -> {
                    if (!existing.getEmail().equalsIgnoreCase(dto.getEmail()) &&
                            userRepository.existsByEmailIgnoreCase(dto.getEmail())) {
                        return ResponseEntity.badRequest().<Map<String, Object>>body(Map.of("message", "Email já em uso"));
                    }
                    existing.setEmail(dto.getEmail().trim().toLowerCase());
                    existing.setFullName(dto.getFullName());
                    existing.setRole(dto.getRole());
                    if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                        existing.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
                    }
                    User saved = userRepository.save(existing);
                    return ResponseEntity.ok(toResponseMap(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toResponseMap(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId().toString());
        m.put("email", u.getEmail());
        m.put("fullName", u.getFullName());
        m.put("role", u.getRole());
        m.put("memberApplicationId", u.getMemberApplicationId() != null ? u.getMemberApplicationId().toString() : null);
        m.put("mustChangePassword", u.isMustChangePassword());
        m.put("active", true);
        m.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "");
        return m;
    }
}
