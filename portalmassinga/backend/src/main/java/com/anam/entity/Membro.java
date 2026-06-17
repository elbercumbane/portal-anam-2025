package com.anam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "membros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Membro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Dados Pessoais (Obrigatórios)
    @Column(name = "foto", columnDefinition = "TEXT")
    private String foto; // Base64 ou URL

    @NotBlank(message = "Nome completo é obrigatório")
    @Column(name = "nome_completo", nullable = false, length = 255)
    private String nomeCompleto;

    @NotBlank(message = "Nome do pai é obrigatório")
    @Column(name = "nome_pai", nullable = false, length = 255)
    private String nomePai;

    @NotBlank(message = "Nome da mãe é obrigatório")
    @Column(name = "nome_mae", nullable = false, length = 255)
    private String nomeMae;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @NotBlank(message = "Estado civil é obrigatório")
    @Column(name = "estado_civil", nullable = false, length = 50)
    private String estadoCivil;

    @NotBlank(message = "Profissão é obrigatória")
    @Column(name = "profissao", nullable = false, length = 255)
    private String profissao;

    // Contatos (Obrigatórios)
    @NotBlank(message = "Celular é obrigatório")
    @Column(name = "celular", nullable = false, length = 20)
    private String celular;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(name = "email", nullable = false, length = 255, unique = true)
    private String email;

    @Column(name = "telefone", length = 20)
    private String telefone; // Opcional

    @NotBlank(message = "Rua/Avenida é obrigatória")
    @Column(name = "rua", nullable = false, length = 255)
    private String rua;

    @NotBlank(message = "Bairro é obrigatório")
    @Column(name = "bairro", nullable = false, length = 255)
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(name = "cidade", nullable = false, length = 255)
    private String cidade;

    // Informações do Cônjuge (Opcional)
    @Column(name = "nome_conjuge", length = 255)
    private String nomeConjuge;

    @Column(name = "data_nascimento_conjuge")
    private LocalDate dataNascimentoConjuge;

    @Column(name = "filiacao_pai_conjuge", length = 255)
    private String filiacaoPaiConjuge;

    @Column(name = "filiacao_mae_conjuge", length = 255)
    private String filiacaoMaeConjuge;

    // Trabalho (Opcional)
    @Column(name = "local_trabalho", length = 255)
    private String localTrabalho;

    @Column(name = "cargo", length = 255)
    private String cargo;

    @Column(name = "endereco_trabalho", length = 255)
    private String enderecoTrabalho;

    @Column(name = "telefone_trabalho", length = 20)
    private String telefoneTrabalho;

    // Outras Informações (Opcional)
    @Column(name = "outras_informacoes", columnDefinition = "TEXT")
    private String outrasInformacoes;

    // Aceitação de Termos
    @NotNull(message = "Aceitar termos é obrigatório")
    @Column(name = "aceita_termos", nullable = false)
    private Boolean aceitaTermos = false;

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
        if (aceitaTermos == null) {
            aceitaTermos = false;
        }
    }
}
