-- Adiciona coluna para forçar alteração de senha no primeiro login
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT true;
COMMENT ON COLUMN users.must_change_password IS 'Se true, utilizador deve alterar senha no próximo login';
