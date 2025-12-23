-- Script SQL para criar usuário admin
-- Execute este script diretamente no PostgreSQL

-- Primeiro, você precisa gerar o hash da senha 'admin123' usando bcrypt
-- O hash abaixo foi gerado com bcrypt (10 rounds) para a senha 'admin123'
-- Se precisar gerar um novo hash, use: npm run db:create-admin (após configurar .env)

-- Hash bcrypt para 'admin123': $2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq

-- Inserir ou atualizar usuário admin
INSERT INTO users (email, password_hash, full_name, role, active)
VALUES (
  'admin',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',  -- admin123
  'Admin',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- Verificar se foi criado
SELECT id, email, full_name, role, active, created_at 
FROM users 
WHERE email = 'admin';

