package com.anam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApoianteDTO {
    
    @NotBlank(message = "Nome completo é obrigatório")
    private String nomeCompleto;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    @NotBlank(message = "Contacto é obrigatório")
    private String contacto;
    
    @NotBlank(message = "Tipo de apoio é obrigatório")
    private String tipoApoio; // valores-monetarios, financiamento, bens, servicos, outros
    
    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;
    
    @NotNull(message = "Anonimato é obrigatório")
    private Boolean anonimato;
}
