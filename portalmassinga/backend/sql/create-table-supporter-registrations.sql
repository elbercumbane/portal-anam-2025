-- Tabela para registos de apoiantes (formulário Torne-se Apoiante - apoio/torne-se-apoiante)
-- Execute na base de dados anam2025 (pgAdmin: botão direito em anam2025 > Query Tool > colar e Executar)

-- Garantir extensão UUID (se ainda não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de registos de apoiantes
CREATE TABLE IF NOT EXISTS supporter_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    support_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registration_device VARCHAR(255),
    registration_browser VARCHAR(255),
    registration_user_agent TEXT
);

-- Índices para consultas
CREATE INDEX IF NOT EXISTS idx_supporter_registrations_email ON supporter_registrations(email);
CREATE INDEX IF NOT EXISTS idx_supporter_registrations_created_at ON supporter_registrations(created_at DESC);
