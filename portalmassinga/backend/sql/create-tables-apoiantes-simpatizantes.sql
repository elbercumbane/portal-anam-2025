-- Script SQL para criar tabelas de Apoiantes e Simpatizantes
-- Execute este script no banco de dados ANAM

-- Habilitar extensão UUID (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: APOIANTES
-- ============================================
CREATE TABLE IF NOT EXISTS apoiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Dados Pessoais (Obrigatórios)
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contacto VARCHAR(20) NOT NULL,
    
    -- Informações de Apoio
    tipo_apoio VARCHAR(50) NOT NULL, -- valores-monetarios, financiamento, bens, servicos, outros
    descricao TEXT NOT NULL,
    anonimato BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Status do Cadastro
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Aprovado, Rejeitado
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    observacoes TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_apoiantes_email ON apoiantes(email);
CREATE INDEX IF NOT EXISTS idx_apoiantes_status ON apoiantes(status);
CREATE INDEX IF NOT EXISTS idx_apoiantes_data_cadastro ON apoiantes(data_cadastro);
CREATE INDEX IF NOT EXISTS idx_apoiantes_tipo_apoio ON apoiantes(tipo_apoio);

-- Comentários nas colunas para documentação
COMMENT ON TABLE apoiantes IS 'Tabela para armazenar os apoiantes cadastrados na associação ANAM';
COMMENT ON COLUMN apoiantes.id IS 'Identificador único do apoiante (UUID)';
COMMENT ON COLUMN apoiantes.nome_completo IS 'Nome completo do apoiante';
COMMENT ON COLUMN apoiantes.email IS 'Email único do apoiante';
COMMENT ON COLUMN apoiantes.tipo_apoio IS 'Tipo de apoio oferecido: valores-monetarios, financiamento, bens, servicos, outros';
COMMENT ON COLUMN apoiantes.anonimato IS 'Se o apoiante deseja manter anonimato';
COMMENT ON COLUMN apoiantes.status IS 'Status do cadastro: Pendente, Aprovado, Rejeitado';

-- ============================================
-- TABELA: SIMPATIZANTES
-- ============================================
CREATE TABLE IF NOT EXISTS simpatizantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Dados Pessoais (Obrigatórios)
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    
    -- Consentimento
    consentimento BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Status do Cadastro
    status VARCHAR(50) DEFAULT 'Ativo', -- Ativo, Inativo
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_simpatizantes_email ON simpatizantes(email);
CREATE INDEX IF NOT EXISTS idx_simpatizantes_status ON simpatizantes(status);
CREATE INDEX IF NOT EXISTS idx_simpatizantes_data_cadastro ON simpatizantes(data_cadastro);

-- Comentários nas colunas para documentação
COMMENT ON TABLE simpatizantes IS 'Tabela para armazenar os simpatizantes cadastrados na associação ANAM';
COMMENT ON COLUMN simpatizantes.id IS 'Identificador único do simpatizante (UUID)';
COMMENT ON COLUMN simpatizantes.nome_completo IS 'Nome completo do simpatizante';
COMMENT ON COLUMN simpatizantes.email IS 'Email único do simpatizante';
COMMENT ON COLUMN simpatizantes.consentimento IS 'Se o simpatizante aceitou os termos e condições';
COMMENT ON COLUMN simpatizantes.status IS 'Status do cadastro: Ativo, Inativo';
