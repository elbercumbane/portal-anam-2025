package com.anam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "simpatizantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Simpatizante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Dados Pessoais (Obrigatórios)
    @NotBlank(message = "Nome completo é obrigatório")
    @Column(name = "nome_completo", nullable = false, length = 255)
    private String nomeCompleto;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone;

    // Consentimento
    @NotNull(message = "Consentimento é obrigatório")
    @Column(name = "consentimento", nullable = false)
    private Boolean consentimento = false;

    // Status do Cadastro
    @Column(name = "status", length = 50)
    private String status = "Ativo"; // Ativo, Inativo

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @PrePersist
    protected void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
        if (status == null) {
            status = "Ativo";
        }
        if (consentimento == null) {
            consentimento = false;
        }
    }
}
