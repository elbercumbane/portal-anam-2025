-- =====================================================
-- SCRIPT COMPLETO DE SETUP - BASE DE DADOS PORTAL ANAM
-- =====================================================
-- Este script cria todas as tabelas necessárias para o Portal ANAM
-- Execute este script após criar a base de dados
-- 
-- Como usar:
--   1. Conecte-se ao PostgreSQL como usuário 'postgres'
--   2. Crie a base de dados: CREATE DATABASE anam2025;
--   3. Conecte-se à base: \c anam2025
--   4. Execute este script: \i SCRIPT-SETUP-COMPLETO.sql
--
-- Ou via linha de comando:
--   psql -U postgres -d anam2025 -f SCRIPT-SETUP-COMPLETO.sql
-- =====================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: home_content
-- Armazena conteúdo parametrizável da página inicial
-- =====================================================
CREATE TABLE IF NOT EXISTS home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
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

-- Comentários
COMMENT ON TABLE home_content IS 'Armazena o conteúdo parametrizável da página inicial do portal';
COMMENT ON COLUMN home_content.section_key IS 'Chave única que identifica a seção (ex: hero_slide_1, sobre_anam)';
COMMENT ON COLUMN home_content.title IS 'Título da seção';
COMMENT ON COLUMN home_content.subtitle IS 'Subtítulo da seção';
COMMENT ON COLUMN home_content.content IS 'Conteúdo HTML ou texto longo da seção';
COMMENT ON COLUMN home_content.image_url IS 'URL da imagem ou base64 (TEXT para suportar imagens grandes)';
COMMENT ON COLUMN home_content.order_index IS 'Índice para ordenação das seções';
COMMENT ON COLUMN home_content.is_active IS 'Indica se o conteúdo está ativo e deve ser exibido';
COMMENT ON COLUMN home_content.metadata IS 'Dados adicionais em formato JSON';

-- =====================================================
-- TABELA: membros
-- Armazena dados dos membros cadastrados
-- =====================================================
CREATE TABLE IF NOT EXISTS membros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    foto TEXT,
    nome_completo VARCHAR(255) NOT NULL,
    nome_pai VARCHAR(255) NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(50) NOT NULL,
    profissao VARCHAR(255) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    endereco TEXT,
    cidade VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Moçambique',
    numero_membro VARCHAR(50) UNIQUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Ativo',
    observacoes TEXT
);

CREATE INDEX IF NOT EXISTS idx_membros_email ON membros(email);
CREATE INDEX IF NOT EXISTS idx_membros_numero_membro ON membros(numero_membro);
CREATE INDEX IF NOT EXISTS idx_membros_status ON membros(status);

-- =====================================================
-- TABELA: apoiantes
-- Armazena dados dos apoiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS apoiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contacto VARCHAR(20) NOT NULL,
    tipo_apoio VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    anonimato BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Pendente',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_apoiantes_email ON apoiantes(email);
CREATE INDEX IF NOT EXISTS idx_apoiantes_status ON apoiantes(status);

-- =====================================================
-- TABELA: simpatizantes
-- Armazena dados dos simpatizantes
-- =====================================================
CREATE TABLE IF NOT EXISTS simpatizantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    consentimento BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Ativo',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);

CREATE INDEX IF NOT EXISTS idx_simpatizantes_email ON simpatizantes(email);
CREATE INDEX IF NOT EXISTS idx_simpatizantes_status ON simpatizantes(status);

-- =====================================================
-- TABELA: member_applications
-- Armazena candidaturas de membros (pendentes de aprovação)
-- =====================================================
CREATE TABLE IF NOT EXISTS member_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo TEXT,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    marital_status VARCHAR(50) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    mobile_phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Moçambique',
    application_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pendente',
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_member_applications_email ON member_applications(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON member_applications(status);

-- =====================================================
-- TABELA: application_dependents
-- Armazena dependentes das candidaturas
-- =====================================================
CREATE TABLE IF NOT EXISTS application_dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES member_applications(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    birth_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_application_dependents_application_id ON application_dependents(application_id);

-- =====================================================
-- MENSAGEM DE CONCLUSÃO
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SETUP COMPLETO!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tabelas criadas com sucesso:';
    RAISE NOTICE '  - home_content';
    RAISE NOTICE '  - membros';
    RAISE NOTICE '  - apoiantes';
    RAISE NOTICE '  - simpatizantes';
    RAISE NOTICE '  - member_applications';
    RAISE NOTICE '  - application_dependents';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Próximos passos:';
    RAISE NOTICE '  1. Configurar application.properties';
    RAISE NOTICE '  2. Iniciar o backend';
    RAISE NOTICE '  3. (Opcional) Executar initialize-home-content.sql';
    RAISE NOTICE '========================================';
END $$;
