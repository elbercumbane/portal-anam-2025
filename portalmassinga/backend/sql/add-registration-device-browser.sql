-- Adicionar colunas de registo (dispositivo, navegador, user-agent) à tabela member_applications
-- Execute na base de dados anam2025 se a tabela já existir sem estas colunas

ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS registration_device VARCHAR(255),
ADD COLUMN IF NOT EXISTS registration_browser VARCHAR(255),
ADD COLUMN IF NOT EXISTS registration_user_agent TEXT;
