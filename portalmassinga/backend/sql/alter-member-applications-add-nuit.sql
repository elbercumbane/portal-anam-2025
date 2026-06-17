-- Adicionar coluna NUIT à tabela de candidaturas de membros
-- NUIT = Número Único de Identidade Tributária (Moçambique)

ALTER TABLE member_applications
ADD COLUMN IF NOT EXISTS nuit VARCHAR(21);

COMMENT ON COLUMN member_applications.nuit IS 'Número Único de Identidade Tributária (Moçambique)';

-- Índice para busca por NUIT
CREATE INDEX IF NOT EXISTS idx_member_applications_nuit ON member_applications(nuit) WHERE nuit IS NOT NULL;
