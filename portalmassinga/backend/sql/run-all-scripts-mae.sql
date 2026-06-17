-- =============================================================================
-- SCRIPT MÃE — Portal ANAM (anam2025)
-- =============================================================================
-- Executar no pgAdmin 4:
--   1. Conecte-se ao servidor PostgreSQL
--   2. Botão direito na base "anam2025" → Query Tool
--   3. Abra este ficheiro (ou cole o conteúdo)
--   4. Execute (F5)
--
-- Pré-requisito: a base de dados "anam2025" já deve existir.
-- Este script é idempotente (pode executar várias vezes sem erro).
--
-- Ordem dos scripts incluídos:
--   1.  create-database-anam2025.sql      (tabelas principais, sem CREATE DATABASE)
--   2.  add-registration-device-browser.sql
--   3.  alter-member-applications-add-nuit.sql
--   4.  alter-supporter-registrations-add-workflow.sql
--   5.  alter-sympathizer-registrations-add-nuit.sql
--   6.  alter-table-events-add-fields.sql
--   7.  create-table-home-content.sql
--   8.  create-table-quota-payments.sql
--   9.  create-table-users.sql
--  10.  alter-users-add-must-change-password.sql
--
-- Nota: insert-admin-accounts.sql não é necessário — as contas admin são
--       criadas automaticamente pelo backend (DataLoader) no primeiro arranque.
-- =============================================================================

DO $$ BEGIN
    RAISE NOTICE '>>> [1/10] Extensão UUID e tabelas principais (create-database-anam2025.sql)';
END $$;

-- -----------------------------------------------------------------------------
-- [1] create-database-anam2025.sql (sem CREATE DATABASE)
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    phone VARCHAR(20),
    street VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    spouse_name VARCHAR(255),
    spouse_birth_date DATE,
    spouse_father_name VARCHAR(255),
    spouse_mother_name VARCHAR(255),
    workplace VARCHAR(255),
    position VARCHAR(255),
    work_address VARCHAR(255),
    work_phone VARCHAR(20),
    additional_information TEXT,
    accepts_terms BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    observations TEXT,
    registration_device VARCHAR(255),
    registration_browser VARCHAR(255),
    registration_user_agent TEXT
);

CREATE TABLE IF NOT EXISTS application_dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50),
    profession VARCHAR(255),
    age INTEGER,
    FOREIGN KEY (application_id) REFERENCES member_applications(id) ON DELETE CASCADE
);

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

CREATE INDEX IF NOT EXISTS idx_member_applications_email ON member_applications(email);
CREATE INDEX IF NOT EXISTS idx_member_applications_status ON member_applications(status);
CREATE INDEX IF NOT EXISTS idx_member_applications_created_at ON member_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_application_dependents_application_id ON application_dependents(application_id);
CREATE INDEX IF NOT EXISTS idx_supporter_registrations_email ON supporter_registrations(email);
CREATE INDEX IF NOT EXISTS idx_supporter_registrations_created_at ON supporter_registrations(created_at DESC);

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

DO $$ BEGIN
    RAISE NOTICE '>>> [2/10] add-registration-device-browser.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [2] add-registration-device-browser.sql
-- -----------------------------------------------------------------------------

ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS registration_device VARCHAR(255),
ADD COLUMN IF NOT EXISTS registration_browser VARCHAR(255),
ADD COLUMN IF NOT EXISTS registration_user_agent TEXT;

DO $$ BEGIN
    RAISE NOTICE '>>> [3/10] alter-member-applications-add-nuit.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [3] alter-member-applications-add-nuit.sql
-- -----------------------------------------------------------------------------

ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS nuit VARCHAR(21);

COMMENT ON COLUMN member_applications.nuit IS 'Número Único de Identidade Tributária (Moçambique)';

CREATE INDEX IF NOT EXISTS idx_member_applications_nuit ON member_applications(nuit) WHERE nuit IS NOT NULL;

DO $$ BEGIN
    RAISE NOTICE '>>> [4/10] alter-supporter-registrations-add-workflow.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [4] alter-supporter-registrations-add-workflow.sql
-- -----------------------------------------------------------------------------

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS wants_account BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS funds_confirmed BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS account_created BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS phone_2 VARCHAR(50);

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS phone_whatsapp BOOLEAN DEFAULT FALSE;

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS phone_2_whatsapp BOOLEAN DEFAULT FALSE;

DO $$ BEGIN
    RAISE NOTICE '>>> [5/10] alter-sympathizer-registrations-add-nuit.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [5] alter-sympathizer-registrations-add-nuit.sql
-- -----------------------------------------------------------------------------

ALTER TABLE sympathizer_registrations
ADD COLUMN IF NOT EXISTS nuit VARCHAR(21);

COMMENT ON COLUMN sympathizer_registrations.nuit IS 'Número de Identificação Fiscal Único (Moçambique)';

DO $$ BEGIN
    RAISE NOTICE '>>> [6/10] alter-table-events-add-fields.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [6] alter-table-events-add-fields.sql
-- -----------------------------------------------------------------------------

ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date_start VARCHAR(100);
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date_end VARCHAR(100);
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_cancelled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cancelled_message TEXT;

UPDATE events
SET event_date_start = event_date, event_date_end = event_date
WHERE event_date_start IS NULL AND event_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_is_cancelled ON events(is_cancelled);

DO $$ BEGIN
    RAISE NOTICE '>>> [7/10] create-table-home-content.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [7] create-table-home-content.sql
-- -----------------------------------------------------------------------------

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

CREATE INDEX IF NOT EXISTS idx_home_content_section_key ON home_content(section_key);
CREATE INDEX IF NOT EXISTS idx_home_content_is_active ON home_content(is_active);
CREATE INDEX IF NOT EXISTS idx_home_content_order_index ON home_content(order_index);

COMMENT ON TABLE home_content IS 'Armazena o conteúdo parametrizável da página inicial do portal';
COMMENT ON COLUMN home_content.section_key IS 'Chave única que identifica a seção (ex: hero_slide_1, sobre_anam)';
COMMENT ON COLUMN home_content.title IS 'Título da seção';
COMMENT ON COLUMN home_content.subtitle IS 'Subtítulo da seção';
COMMENT ON COLUMN home_content.content IS 'Conteúdo HTML ou texto longo da seção';
COMMENT ON COLUMN home_content.image_url IS 'URL da imagem associada à seção';
COMMENT ON COLUMN home_content.order_index IS 'Índice para ordenação das seções';
COMMENT ON COLUMN home_content.is_active IS 'Indica se o conteúdo está ativo e deve ser exibido';
COMMENT ON COLUMN home_content.metadata IS 'Dados adicionais em formato JSON';

DO $$ BEGIN
    RAISE NOTICE '>>> [8/10] create-table-quota-payments.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [8] create-table-quota-payments.sql
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quota_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_application_id UUID NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Paid',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quota_member
        FOREIGN KEY (member_application_id) REFERENCES member_applications(id) ON DELETE CASCADE,
    CONSTRAINT chk_month_range CHECK (month >= 1 AND month <= 12)
);

CREATE INDEX IF NOT EXISTS idx_quota_payments_member ON quota_payments(member_application_id);
CREATE INDEX IF NOT EXISTS idx_quota_payments_year_month ON quota_payments(year, month);

COMMENT ON TABLE quota_payments IS 'Pagamentos de cotas mensais dos membros. Vinculado ao member_applications via NUIT.';
COMMENT ON COLUMN quota_payments.member_application_id IS 'ID da candidatura aprovada (membro)';
COMMENT ON COLUMN quota_payments.amount IS 'Valor pago em MZN';
COMMENT ON COLUMN quota_payments.payment_method IS 'M-Pesa, Emola, Transferência, Dinheiro, Visa, etc.';

DO $$ BEGIN
    RAISE NOTICE '>>> [9/10] create-table-users.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [9] create-table-users.sql
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'membro',
    member_application_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_member
        FOREIGN KEY (member_application_id) REFERENCES member_applications(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_member ON users(member_application_id) WHERE member_application_id IS NOT NULL;

COMMENT ON TABLE users IS 'Utilizadores do sistema: administradores e membros';
COMMENT ON COLUMN users.role IS 'admin: dashboard | membro: área de membros';
COMMENT ON COLUMN users.member_application_id IS 'Se preenchido, vincula à candidatura aprovada (para membros ou admin que também é membro)';

DO $$ BEGIN
    RAISE NOTICE '>>> [10/10] alter-users-add-must-change-password.sql';
END $$;

-- -----------------------------------------------------------------------------
-- [10] alter-users-add-must-change-password.sql
-- -----------------------------------------------------------------------------

ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT true;
COMMENT ON COLUMN users.must_change_password IS 'Se true, utilizador deve alterar senha no próximo login';

-- -----------------------------------------------------------------------------
-- [11] seed-demo-quota-members.sql — Membros demo para apresentação
-- NUIT 400111222 (em dia) · NUIT 400333444 (com dívidas)
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    RAISE NOTICE '>>> [11/11] seed-demo-quota-members';
END $$;

DELETE FROM quota_payments WHERE member_application_id IN (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'a2222222-2222-2222-2222-222222222222'::uuid
);
DELETE FROM member_applications WHERE id IN (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'a2222222-2222-2222-2222-222222222222'::uuid
);

INSERT INTO member_applications (
    id, full_name, father_name, mother_name, birth_date, marital_status, profession,
    mobile_phone, email, street, neighborhood, city, accepts_terms, status,
    approved_at, nuit, created_at
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Ana Machel Demo', 'João Machel', 'Maria Machel', '1990-05-15', 'Solteiro', 'Engenheira',
    '841234567', 'ana.demo@anam.co.mz', 'Av. Julius Nyerere', 'Sommerschield', 'Maputo',
    true, 'Approved', '2025-01-01 08:00:00', '400111222', '2024-12-01 10:00:00'
);

INSERT INTO member_applications (
    id, full_name, father_name, mother_name, birth_date, marital_status, profession,
    mobile_phone, email, street, neighborhood, city, accepts_terms, status,
    approved_at, nuit, created_at
) VALUES (
    'a2222222-2222-2222-2222-222222222222',
    'Carlos Cumbane Demo', 'Pedro Cumbane', 'Rosa Cumbane', '1988-08-20', 'Casado', 'Professor',
    '871234567', 'carlos.demo@anam.co.mz', 'Rua da Resistência', 'Central', 'Massinga',
    true, 'Approved', '2025-01-01 08:00:00', '400333444', '2024-12-01 10:00:00'
);

INSERT INTO quota_payments (member_application_id, year, month, amount, payment_date, payment_method, reference, status)
SELECT 'a1111111-1111-1111-1111-111111111111', 2025, m, 1200, ('2025-' || LPAD(m::text, 2, '0') || '-05')::date, 'M-Pesa', 'PAY-DEMO-ANA-' || m, 'Paid'
FROM generate_series(1, 6) AS m;

INSERT INTO quota_payments (member_application_id, year, month, amount, payment_date, payment_method, reference, status) VALUES
    ('a2222222-2222-2222-2222-222222222222', 2025, 1, 1200, '2025-01-10', 'M-Pesa', 'PAY-DEMO-CAR-1', 'Paid'),
    ('a2222222-2222-2222-2222-222222222222', 2025, 2, 1200, '2025-02-10', 'Emola', 'PAY-DEMO-CAR-2', 'Paid');

-- -----------------------------------------------------------------------------
-- Concluído
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'Script mãe concluído com sucesso na base anam2025.';
    RAISE NOTICE 'Contas admin (admin@anam.co.mz / admin123) são criadas ao iniciar o backend.';
    RAISE NOTICE '=============================================================================';
END $$;
