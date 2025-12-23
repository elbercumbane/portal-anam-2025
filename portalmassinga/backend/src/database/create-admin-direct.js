// Script Node.js para criar admin diretamente
// Este script gera o hash e mostra o SQL para executar manualmente

const bcrypt = require('bcryptjs');

async function generateAdminSQL() {
  try {
    console.log('🔐 Gerando hash da senha e SQL para criar admin...\n');
    
    // Gerar hash da senha admin123
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    console.log('✅ Hash gerado com sucesso!\n');
    console.log('📝 Execute o seguinte SQL no seu banco de dados PostgreSQL:\n');
    console.log('─'.repeat(80));
    console.log(`
INSERT INTO users (email, password_hash, full_name, role, active)
VALUES (
  'admin',
  '${passwordHash}',
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
`);
    console.log('─'.repeat(80));
    console.log('\n📋 Credenciais:');
    console.log('   Email: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin\n');
    
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error);
    process.exit(1);
  }
}

generateAdminSQL();

