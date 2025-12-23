-- Database Schema for ANAM Portal
-- PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for system authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'membro',
    department VARCHAR(100),
    province VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    member_id UUID REFERENCES members(id) ON DELETE SET NULL
);

-- Member Applications table (candidaturas pendentes)
CREATE TABLE IF NOT EXISTS member_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Dados Pessoais
    nome VARCHAR(255) NOT NULL,
    nome_pai VARCHAR(255) NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(50) NOT NULL,
    profissao VARCHAR(255) NOT NULL,
    -- Contatos
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    rua VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    -- Cônjuge (opcional)
    nome_conjuge VARCHAR(255),
    data_nascimento_conjuge DATE,
    filiacao_pai_conjuge VARCHAR(255),
    filiacao_mae_conjuge VARCHAR(255),
    -- Trabalho (opcional)
    local_trabalho VARCHAR(255),
    cargo VARCHAR(255),
    endereco_trabalho VARCHAR(255),
    telefone_trabalho VARCHAR(20),
    -- Outros
    foto TEXT, -- Base64 ou URL
    outras_informacoes TEXT,
    aceita_termos BOOLEAN NOT NULL DEFAULT false,
    -- Status da candidatura
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Aprovado, Rejeitado
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    aprovado_por UUID REFERENCES users(id),
    observacoes TEXT
);

-- Members table (membros aprovados)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Dados Pessoais
    nome VARCHAR(255) NOT NULL,
    nome_pai VARCHAR(255) NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(50) NOT NULL,
    profissao VARCHAR(255) NOT NULL,
    -- Contatos
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    rua VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    -- Cônjuge (opcional)
    nome_conjuge VARCHAR(255),
    data_nascimento_conjuge DATE,
    filiacao_pai_conjuge VARCHAR(255),
    filiacao_mae_conjuge VARCHAR(255),
    -- Trabalho (opcional)
    local_trabalho VARCHAR(255),
    cargo VARCHAR(255),
    endereco_trabalho VARCHAR(255),
    telefone_trabalho VARCHAR(20),
    -- Outros
    foto TEXT, -- Base64 ou URL
    outras_informacoes TEXT,
    -- Status e controle
    status VARCHAR(50) DEFAULT 'Ativo', -- Ativo, Inativo, Suspenso
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    application_id UUID REFERENCES member_applications(id),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dependents table (dependentes dos membros)
CREATE TABLE IF NOT EXISTS dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    profissao VARCHAR(255),
    idade INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table (pagamentos/cotas)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'quota', 'doacao', 'outro'
    valor DECIMAL(10, 2) NOT NULL,
    mes_referencia VARCHAR(20),
    ano_referencia INTEGER,
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento VARCHAR(50), -- 'transferencia', 'dinheiro', 'cheque'
    referencia VARCHAR(255),
    comprovante TEXT, -- Base64 ou URL
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Confirmado, Cancelado
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Projects table (projetos disponíveis)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    area VARCHAR(100) NOT NULL,
    valor_disponivel DECIMAL(12, 2),
    prazo_candidatura DATE,
    data_inicio DATE,
    duracao VARCHAR(100),
    organizacao VARCHAR(255),
    requisitos TEXT[], -- Array de requisitos
    beneficios TEXT[], -- Array de benefícios
    status VARCHAR(50) DEFAULT 'Disponivel', -- Disponivel, EmAndamento, Concluido, Cancelado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Project Applications table (candidaturas a projetos)
CREATE TABLE IF NOT EXISTS project_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    -- Dados da Organização
    nome_organizacao VARCHAR(255) NOT NULL,
    tipo_organizacao VARCHAR(100) NOT NULL,
    nif VARCHAR(50) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    -- Dados do Representante
    nome_representante VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    telefone_representante VARCHAR(20) NOT NULL,
    email_representante VARCHAR(255) NOT NULL,
    -- Dados do Projeto
    titulo_projeto VARCHAR(255) NOT NULL,
    descricao_projeto TEXT NOT NULL,
    objetivos TEXT NOT NULL,
    metodologia TEXT NOT NULL,
    cronograma TEXT NOT NULL,
    orcamento DECIMAL(12, 2) NOT NULL,
    contrapartida TEXT,
    -- Anexos (URLs ou paths)
    estatutos_url TEXT,
    nif_document_url TEXT,
    projeto_powerpoint_url TEXT,
    outros_documentos TEXT[],
    -- Status
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Aprovado, Rejeitado
    data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_avaliacao TIMESTAMP,
    avaliado_por UUID REFERENCES users(id),
    observacoes TEXT,
    -- Termos
    aceita_termos BOOLEAN NOT NULL DEFAULT false,
    autoriza_dados BOOLEAN NOT NULL DEFAULT false
);

-- Partners table (parceiros)
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descricao TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    contato_email VARCHAR(255),
    contato_telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    data_inicio DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treasury table (tesouraria - receitas e despesas)
CREATE TABLE IF NOT EXISTS treasury (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL, -- 'receita', 'despesa'
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(12, 2) NOT NULL,
    data_transacao DATE NOT NULL,
    metodo_pagamento VARCHAR(50),
    referencia VARCHAR(255),
    comprovante_url TEXT,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_email ON member_applications(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON member_applications(status);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_dependents_member_id ON dependents(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_status ON project_applications(status);
CREATE INDEX IF NOT EXISTS idx_treasury_tipo ON treasury(tipo);
CREATE INDEX IF NOT EXISTS idx_treasury_data_transacao ON treasury(data_transacao);

