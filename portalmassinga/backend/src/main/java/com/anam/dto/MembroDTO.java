package com.anam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MembroDTO {
    
    // Dados Pessoais (Obrigatórios)
    private String foto;
    
    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;
    
    @NotBlank(message = "Nome do pai é obrigatório")
    private String nomePai;
    
    @NotBlank(message = "Nome da mãe é obrigatório")
    private String nomeMae;
    
    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate dataNascimento;
    
    @NotBlank(message = "Estado civil é obrigatório")
    private String estadoCivil;
    
    @NotBlank(message = "Profissão é obrigatória")
    private String profissao;
    
    // Contatos (Obrigatórios)
    @NotBlank(message = "Celular é obrigatório")
    private String celular;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    private String telefone; // Opcional
    
    @NotBlank(message = "Rua/Avenida é obrigatória")
    private String rua;
    
    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;
    
    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;
    
    // Informações do Cônjuge (Opcional)
    private String nomeConjuge;
    private LocalDate dataNascimentoConjuge;
    private String filiacaoPaiConjuge;
    private String filiacaoMaeConjuge;
    
    // Trabalho (Opcional)
    private String localTrabalho;
    private String cargo;
    private String enderecoTrabalho;
    private String telefoneTrabalho;
    
    // Outras Informações (Opcional)
    private String outrasInformacoes;
    
    // Aceitação de Termos
    @NotNull(message = "Aceitar termos é obrigatório")
    private Boolean aceitaTermos;
}
