-- Script SQL para criar a base de dados ANAM
-- Execute este script no pgAdmin4 ou via psql
-- 
-- INSTRUÇÕES:
-- 1. Primeiro, crie a base de dados ANAM manualmente no pgAdmin4:
--    - Clique com botão direito em "Databases" > "Create" > "Database"
--    - Nome: ANAM
--    - Clique em "Save"
--
-- 2. Depois, conecte-se à base de dados ANAM e execute este script

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para armazenar membros cadastrados
CREATE TABLE IF NOT EXISTS membros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Dados Pessoais (Obrigatórios)
    foto TEXT, -- Base64 ou URL
    nome_completo VARCHAR(255) NOT NULL,
    nome_pai VARCHAR(255) NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(50) NOT NULL,
    profissao VARCHAR(255) NOT NULL,
    
    -- Contatos (Obrigatórios)
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20), -- Opcional
    rua VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    
    -- Informações do Cônjuge (Opcional)
    nome_conjuge VARCHAR(255),
    data_nascimento_conjuge DATE,
    filiacao_pai_conjuge VARCHAR(255),
    filiacao_mae_conjuge VARCHAR(255),
    
    -- Trabalho (Opcional)
    local_trabalho VARCHAR(255),
    cargo VARCHAR(255),
    endereco_trabalho VARCHAR(255),
    telefone_trabalho VARCHAR(20),
    
    -- Outras Informações (Opcional)
    outras_informacoes TEXT,
    
    -- Aceitação de Termos
    aceita_termos BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Status do Cadastro
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Aprovado, Rejeitado
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    observacoes TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_membros_email ON membros(email);
CREATE INDEX IF NOT EXISTS idx_membros_status ON membros(status);
CREATE INDEX IF NOT EXISTS idx_membros_data_cadastro ON membros(data_cadastro);
CREATE INDEX IF NOT EXISTS idx_membros_nome_completo ON membros(nome_completo);

-- Comentários nas colunas para documentação
COMMENT ON TABLE membros IS 'Tabela para armazenar os membros cadastrados na associação ANAM';
COMMENT ON COLUMN membros.id IS 'Identificador único do membro (UUID)';
COMMENT ON COLUMN membros.nome_completo IS 'Nome completo do membro';
COMMENT ON COLUMN membros.email IS 'Email único do membro';
COMMENT ON COLUMN membros.status IS 'Status do cadastro: Pendente, Aprovado, Rejeitado';
