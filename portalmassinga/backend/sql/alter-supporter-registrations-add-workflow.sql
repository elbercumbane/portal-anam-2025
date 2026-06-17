-- Adicionar colunas para fluxo de confirmação de fundos e criação de conta
-- Execute na base de dados anam2025

-- Deseja criar acesso à área do apoiante (preferência do registo)
ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS wants_account BOOLEAN NOT NULL DEFAULT FALSE;

-- Fundos/doação foram confirmados pelo administrador
ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS funds_confirmed BOOLEAN NOT NULL DEFAULT FALSE;

-- Conta de acesso foi criada (após confirmação dos fundos)
ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS account_created BOOLEAN NOT NULL DEFAULT FALSE;

-- Telefone secundário (opcional)
ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS phone_2 VARCHAR(50);

-- WhatsApp nos contactos
ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS phone_whatsapp BOOLEAN DEFAULT FALSE;

ALTER TABLE supporter_registrations
ADD COLUMN IF NOT EXISTS phone_2_whatsapp BOOLEAN DEFAULT FALSE;
