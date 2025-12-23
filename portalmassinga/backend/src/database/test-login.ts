import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD || 'elber123';

async function testLogin() {
  console.log('========================================');
  console.log('  Testar Login do Admin');
  console.log('========================================\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'anam_portal',
    user: process.env.DB_USER || 'postgres',
    password: DB_PASSWORD
  };

  let pool: Pool | null = null;

  try {
    // Conectar
    console.log('🔍 Conectando ao PostgreSQL...');
    pool = new Pool(config);
    await pool.query('SELECT 1');
    console.log('✅ Conectado!\n');

    // Buscar usuário admin
    console.log('📋 Buscando usuário admin@exemplo.com...');
    const userResult = await pool.query(
      'SELECT id, email, password_hash, full_name, role, active FROM users WHERE email = $1',
      ['admin@exemplo.com']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Usuário não encontrado!');
      console.log('\nVerificando se existe usuário com email "admin"...');
      const adminResult = await pool.query(
        "SELECT id, email, full_name, role, active FROM users WHERE email = 'admin'"
      );
      if (adminResult.rows.length > 0) {
        console.log('⚠️  Encontrado usuário com email "admin"');
        console.log('   Execute: npm run db:update-admin-email');
      }
    } else {
      const user = userResult.rows[0];
      console.log('✅ Usuário encontrado!');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.full_name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Ativo: ${user.active}`);

      // Testar senha
      console.log('\n🔒 Testando senha "admin123"...');
      const passwordMatch = await bcrypt.compare('admin123', user.password_hash);
      console.log(`   Senha válida: ${passwordMatch ? '✅ SIM' : '❌ NÃO'}`);

      if (passwordMatch) {
        console.log('\n✅ ✅ ✅ TUDO OK! ✅ ✅ ✅');
        console.log('O login deve funcionar com:');
        console.log('   Email: admin@exemplo.com');
        console.log('   Password: admin123');
      } else {
        console.log('\n❌ A senha não está correta!');
        console.log('   O hash da senha no banco não corresponde a "admin123"');
      }
    }

    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.code) {
      console.error(`   Código: ${error.code}`);
    }
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  }
}

testLogin();

