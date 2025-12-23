import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD || 'elber123';

async function createAll() {
  console.log('========================================');
  console.log('  Criando Tudo Automaticamente');
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

    // Ler schema.sql completo
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📋 Lendo e executando schema.sql completo...');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Executar o schema completo de uma vez
    try {
      await pool.query(schemaSQL);
      console.log('✅ Schema executado com sucesso!\n');
    } catch (error: any) {
      // Se der erro, pode ser que algumas tabelas já existam, continuar
      if (error.message.includes('already exists') || error.code === '42P07') {
        console.log('⚠️  Algumas tabelas já existem, continuando...\n');
      } else {
        throw error;
      }
    }

    // Criar usuário admin
    console.log('🔐 Criando usuário admin...');
    const adminPassword = await bcrypt.hash('admin123', 10);

    const result = await pool.query(`
      INSERT INTO users (email, password_hash, full_name, role, active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        active = EXCLUDED.active
      RETURNING id, email, full_name, role, active
    `, ['admin', adminPassword, 'Admin', 'admin', true]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('\n✅ ✅ ✅ SUCESSO! ✅ ✅ ✅');
      console.log('📝 Usuário admin criado/atualizado!');
      console.log('\n📋 Credenciais:');
      console.log('   Email: admin');
      console.log('   Password: admin123');
      console.log('   Role: admin (todas as permissões)');
      console.log(`   ID: ${user.id}`);
      console.log('\n🎉 Tudo pronto! Agora você pode fazer login!');
      console.log('\nPróximos passos:');
      console.log('  1. Backend: npm run dev');
      console.log('  2. Frontend: cd ../frontend && npm start');
      console.log('  3. Acesse: http://localhost:4200/login');
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

createAll();

