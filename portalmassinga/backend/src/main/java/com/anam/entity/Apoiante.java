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
@Table(name = "apoiantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Apoiante {

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

    @NotBlank(message = "Contacto é obrigatório")
    @Column(name = "contacto", nullable = false, length = 20)
    private String contacto;

    // Informações de Apoio
    @NotBlank(message = "Tipo de apoio é obrigatório")
    @Column(name = "tipo_apoio", nullable = false, length = 50)
    private String tipoApoio; // valores-monetarios, financiamento, bens, servicos, outros

    @NotBlank(message = "Descrição é obrigatória")
    @Column(name = "descricao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "Anonimato é obrigatório")
    @Column(name = "anonimato", nullable = false)
    private Boolean anonimato = false;

    // Status do Cadastro
    @Column(name = "status", length = 50)
    private String status = "Pendente"; // Pendente, Aprovado, Rejeitado

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @Column(name = "data_aprovacao")
    private LocalDateTime dataAprovacao;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @PrePersist
    protected void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
        if (status == null) {
            status = "Pendente";
        }
        if (anonimato == null) {
            anonimato = false;
        }
    }
}
