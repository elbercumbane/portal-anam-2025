package com.anam.config;

import com.anam.entity.User;
import com.anam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria contas de administrador na primeira execução.
 */
@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        String defaultPassword = "anam" + java.time.Year.now().getValue();
        createAdminIfNotExists("admin@anam.co.mz", "Administrador Principal", defaultPassword);
        createAdminIfNotExists("admin2@anam.co.mz", "Administrador Secundário", defaultPassword);
    }

    private void createAdminIfNotExists(String email, String fullName, String plainPassword) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            User admin = new User();
            admin.setEmail(email);
            admin.setFullName(fullName);
            admin.setPasswordHash(passwordEncoder.encode(plainPassword));
            admin.setRole("super-admin");
            admin.setMustChangePassword(true);
            userRepository.save(admin);
            // Log apenas em dev
            System.out.println("[DataLoader] Criada conta admin: " + email);
        }
    }
}
