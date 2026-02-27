-- Adicionar coluna NUIT à tabela de registos de simpatizantes
-- Execute na base de dados anam2025 (pgAdmin: botão direito em anam2025 > Query Tool > colar e Executar)

ALTER TABLE sympathizer_registrations
ADD COLUMN IF NOT EXISTS nuit VARCHAR(21);

COMMENT ON COLUMN sympathizer_registrations.nuit IS 'Número de Identificação Fiscal Único (Moçambique)';
