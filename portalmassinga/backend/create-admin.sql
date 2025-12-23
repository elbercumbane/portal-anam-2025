-- ============================================
-- Script para criar usuário ADMIN
-- Execute este script no PostgreSQL
-- ============================================

-- Inserir ou atualizar usuário admin
-- Email: admin
-- Password: admin123
-- Role: admin

INSERT INTO users (email, password_hash, full_name, role, active)
VALUES (
  'admin',
  '$2a$10$TnCDA5VUrMSMam8M2ybXt.MPWi.ksSw8fL8ghaqU8IZieYVsVEjhG',  -- Hash de 'admin123'
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
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  active, 
  created_at 
FROM users 
WHERE email = 'admin';

-- ============================================
-- Credenciais de acesso:
-- Email: admin
-- Password: admin123
-- Role: admin (todas as permissões)
-- ============================================

