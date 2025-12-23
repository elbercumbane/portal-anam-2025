import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD || 'elber123';

async function updateAdminEmail() {
  console.log('========================================');
  console.log('  Atualizar Email do Admin');
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

    // Atualizar email do admin
    console.log('📧 Atualizando email do admin...');
    const result = await pool.query(`
      UPDATE users 
      SET email = $1 
      WHERE email = 'admin'
      RETURNING id, email, full_name, role
    `, ['admin@exemplo.com']);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('\n✅ ✅ ✅ SUCESSO! ✅ ✅ ✅');
      console.log('📝 Email do admin atualizado!');
      console.log('\n📋 Dados atualizados:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.full_name}`);
      console.log(`   Role: ${user.role}`);
      console.log('\n📋 Credenciais atualizadas:');
      console.log('   Email: admin@exemplo.com');
      console.log('   Password: admin123');
      console.log('\n🎉 Agora você pode fazer login com o novo email!');
    } else {
      console.log('⚠️  Nenhum usuário encontrado com email "admin"');
      console.log('   Verificando se o email já foi atualizado...');
      
      const checkResult = await pool.query(
        "SELECT id, email, full_name, role FROM users WHERE email = 'admin@exemplo.com'"
      );
      
      if (checkResult.rows.length > 0) {
        console.log('✅ O email já está atualizado para admin@exemplo.com');
      } else {
        console.log('❌ Usuário admin não encontrado');
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

updateAdminEmail();

