package com.anam.config;

import org.springframework.context.annotation.Configuration;

/**
 * Configuração do Banco de Dados
 * 
 * O Spring Boot usa automaticamente a configuração do application.properties
 * H2 Database está configurado como padrão (rápido, sem instalação)
 * Para usar PostgreSQL, altere o application.properties
 */
@Configuration
public class DatabaseConfig {
    // Spring Boot configura automaticamente baseado no application.properties
    // Não é necessária configuração adicional aqui
}
