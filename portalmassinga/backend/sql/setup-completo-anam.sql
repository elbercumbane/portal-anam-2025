-- ============================================
-- SCRIPT COMPLETO - SETUP BASE DE DADOS ANAM
-- ============================================
-- Este script cria a base de dados e a tabela membros
-- Execute este script no pgAdmin4 conectado como superusuário (postgres)
--
-- INSTRUÇÕES:
-- 1. Abra o pgAdmin4
-- 2. Conecte-se ao servidor PostgreSQL (como usuário postgres)
-- 3. Clique com botão direito em "Databases" > "Query Tool"
-- 4. Cole este script completo
-- 5. Execute (F5)
-- ============================================

-- Criar base de dados ANAM (se não existir)
-- Nota: Só funciona se executado como superusuário
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ANAM') THEN
        CREATE DATABASE ANAM;
        RAISE NOTICE 'Base de dados ANAM criada!';
    ELSE
        RAISE NOTICE 'Base de dados ANAM já existe.';
    END IF;
END
$$;

-- Conectar à base de dados ANAM
-- Nota: No pgAdmin, você precisa selecionar a base de dados ANAM antes de executar o restante
-- Ou execute o restante do script conectado à base de dados ANAM

-- ============================================
-- EXECUTE O RESTANTE CONECTADO À BASE ANAM
-- ============================================
-- No pgAdmin:
-- 1. Expanda: Servers > PostgreSQL > Databases
-- 2. Clique com botão direito em "ANAM" > "Query Tool"
-- 3. Execute o script abaixo
-- ============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para armazenar membros cadastrados (formulário tornar-se membro)
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
COMMENT ON TABLE membros IS 'Tabela para armazenar os membros cadastrados na associação ANAM através do formulário de tornar-se membro';
COMMENT ON COLUMN membros.id IS 'Identificador único do membro (UUID)';
COMMENT ON COLUMN membros.nome_completo IS 'Nome completo do membro';
COMMENT ON COLUMN membros.email IS 'Email único do membro';
COMMENT ON COLUMN membros.status IS 'Status do cadastro: Pendente, Aprovado, Rejeitado';
COMMENT ON COLUMN membros.data_cadastro IS 'Data e hora do cadastro (automático)';
COMMENT ON COLUMN membros.aceita_termos IS 'Indica se o membro aceitou os termos e condições';

-- Verificar se tudo foi criado corretamente
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros') THEN
        RAISE NOTICE '========================================';
        RAISE NOTICE 'SUCESSO! Tabela membros criada!';
        RAISE NOTICE '========================================';
    ELSE
        RAISE EXCEPTION 'ERRO: Tabela membros não foi criada!';
    END IF;
END
$$;

-- Mostrar informações da tabela
SELECT 
    'Tabela criada com sucesso!' AS status,
    COUNT(*) AS total_colunas
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'membros';
