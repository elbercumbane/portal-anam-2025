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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_member_applications_email ON member_applications(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON member_applications(status);
CREATE INDEX IF NOT EXISTS idx_member_applications_created_at ON member_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_application_dependents_application_id ON application_dependents(application_id);

