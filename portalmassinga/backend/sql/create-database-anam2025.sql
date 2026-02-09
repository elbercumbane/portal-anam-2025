-- Script SQL para criar a base de dados ANAM2025
-- Execute este script no pgAdmin4 ou via psql

-- Criar a base de dados 'anam2025' (se não existir)
-- Nota: Você precisa estar conectado como superusuário para criar a base de dados
-- No pgAdmin4, clique com botão direito em "Databases" > "Create" > "Database"
-- Nome: anam2025
-- Ou execute: CREATE DATABASE anam2025;

-- Conectar à base de dados 'anam2025' antes de executar o restante
-- \c anam2025

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para armazenar candidaturas de membros (formulário associar-se)
CREATE TABLE IF NOT EXISTS member_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Personal Data (Required)
    photo TEXT, -- Base64 or URL
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    marital_status VARCHAR(50) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    
    -- Contacts (Required)
    mobile_phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20), -- Optional
    street VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    
    -- Spouse Information (Optional)
    spouse_name VARCHAR(255),
    spouse_birth_date DATE,
    spouse_father_name VARCHAR(255),
    spouse_mother_name VARCHAR(255),
    
    -- Workplace (Optional)
    workplace VARCHAR(255),
    position VARCHAR(255),
    work_address VARCHAR(255),
    work_phone VARCHAR(20),
    
    -- Additional Information (Optional)
    additional_information TEXT,
    
    -- Honor Commitment
    accepts_terms BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    observations TEXT,

    -- Registo: dispositivo, navegador e User-Agent (data de registo = created_at)
    registration_device VARCHAR(255),
    registration_browser VARCHAR(255),
    registration_user_agent TEXT
);

-- Tabela para armazenar dependentes das candidaturas
CREATE TABLE IF NOT EXISTS application_dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50), -- child, stepchild, other
    profession VARCHAR(255),
    age INTEGER,
    
    FOREIGN KEY (application_id) REFERENCES member_applications(id) ON DELETE CASCADE
);

-- Tabela para registos de apoiantes (Torne-se Apoiante)
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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_member_applications_email ON member_applications(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON member_applications(status);
CREATE INDEX IF NOT EXISTS idx_member_applications_created_at ON member_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_application_dependents_application_id ON application_dependents(application_id);
CREATE INDEX IF NOT EXISTS idx_supporter_registrations_email ON supporter_registrations(email);
CREATE INDEX IF NOT EXISTS idx_supporter_registrations_created_at ON supporter_registrations(created_at DESC);

-- Tabela para registos de simpatizantes (Torne-se Simpatizante)
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

-- Tabela para inscrições em eventos (Inscrever-se em Eventos)
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_date VARCHAR(100),
    event_location VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    participant_type VARCHAR(50) NOT NULL,
    receive_whatsapp BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registration_device VARCHAR(255),
    registration_browser VARCHAR(255),
    registration_user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at DESC);

-- Tabela de eventos (eventos disponíveis para inscrição)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date VARCHAR(100),
    event_date_start VARCHAR(100),
    event_date_end VARCHAR(100),
    end_date DATE,
    location VARCHAR(255),
    time_slot VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    level_access VARCHAR(50),
    is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    cancelled_at TIMESTAMP,
    cancelled_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events (id, title, event_date, event_date_start, event_date_end, location, time_slot, description, image_url, level_access, created_at, updated_at)
VALUES
  ('1', 'Workshop de Agricultura Sustentável', '15 de Janeiro, 2024', '15 de Janeiro, 2024', '15 de Janeiro, 2024', 'Centro Comunitário de Massinga', '09:00 - 16:00', 'Aprenda técnicas modernas de agricultura sustentável.', '/assets/mercado-maputo.jpg', 'publico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('2', 'Feira de Produtos Locais', '22 de Março, 2024', '22 de Março, 2024', '22 de Março, 2024', 'Praça Central de Massinga', '08:00 - 18:00', 'Exposição e venda de produtos artesanais e agrícolas da região.', '/assets/mercado-maputo.jpg', 'publico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('3', 'Conferência de Desenvolvimento Comunitário', '29 de Março, 2024', '29 de Março, 2024', '29 de Março, 2024', 'Auditório Municipal', '14:00 - 18:00', 'Discussão sobre estratégias de desenvolvimento sustentável.', '/assets/desenvolvimento-comunitario.jpg', 'membros', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('4', 'Seminário de Capacitação Empresarial', '5 de Abril, 2024', '5 de Abril, 2024', '5 de Abril, 2024', 'Centro de Formação Profissional', '09:00 - 16:00', 'Capacitação em gestão empresarial e marketing digital.', '/assets/slider/slide1.jpg', 'simpatizantes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_is_cancelled ON events(is_cancelled);
