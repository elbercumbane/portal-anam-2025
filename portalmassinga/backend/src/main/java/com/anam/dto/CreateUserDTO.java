package com.anam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserDTO {
    /** NUIT do membro - se preenchido, busca dados do membro e cria user vinculado */
    private String nuit;

    @Email(message = "Email inválido")
    private String email;

    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String password; // opcional - sistema usa anam+ano se vazio

    private String fullName;

    /** administrador | super-admin | membro (membro só quando nuit preenchido) */
    private String role = "administrador";
}
