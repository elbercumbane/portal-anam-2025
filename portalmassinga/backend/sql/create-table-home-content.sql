-- Script SQL para criar a tabela home_content
-- Esta tabela armazena o conteúdo parametrizável da página inicial do portal
-- Execute este script no pgAdmin4 ou via psql após criar a base de dados anam2025

-- Conectar à base de dados 'anam2025' antes de executar
-- \c anam2025

-- Habilitar extensão UUID (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para armazenar conteúdo da página inicial (parametrizável)
CREATE TABLE IF NOT EXISTS home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url VARCHAR(500),
    order_index INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_home_content_section_key ON home_content(section_key);
CREATE INDEX IF NOT EXISTS idx_home_content_is_active ON home_content(is_active);
CREATE INDEX IF NOT EXISTS idx_home_content_order_index ON home_content(order_index);

-- Comentários nas colunas para documentação
COMMENT ON TABLE home_content IS 'Armazena o conteúdo parametrizável da página inicial do portal';
COMMENT ON COLUMN home_content.section_key IS 'Chave única que identifica a seção (ex: hero_slide_1, sobre_anam)';
COMMENT ON COLUMN home_content.title IS 'Título da seção';
COMMENT ON COLUMN home_content.subtitle IS 'Subtítulo da seção';
COMMENT ON COLUMN home_content.content IS 'Conteúdo HTML ou texto longo da seção';
COMMENT ON COLUMN home_content.image_url IS 'URL da imagem associada à seção';
COMMENT ON COLUMN home_content.order_index IS 'Índice para ordenação das seções';
COMMENT ON COLUMN home_content.is_active IS 'Indica se o conteúdo está ativo e deve ser exibido';
COMMENT ON COLUMN home_content.metadata IS 'Dados adicionais em formato JSON';

