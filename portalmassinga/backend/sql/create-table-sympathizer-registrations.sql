-- Tabela para registos de simpatizantes (Torne-se Simpatizante - simpatizantes/porque-tornar-se)
-- Execute na base de dados anam2025 (pgAdmin: botão direito em anam2025 > Query Tool > colar e Executar)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS sympathizer_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    area_interest VARCHAR(255) NOT NULL,
    accept_communications BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registration_device VARCHAR(255),
    registration_browser VARCHAR(255),
    registration_user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_sympathizer_registrations_email ON sympathizer_registrations(email);
CREATE INDEX IF NOT EXISTS idx_sympathizer_registrations_created_at ON sympathizer_registrations(created_at DESC);
