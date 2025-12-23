import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Carregar .env se existir
dotenv.config();

// Configurações padrão
const defaultConfigs = [
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'anam_portal',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  {
    host: 'localhost',
    port: 5432,
    database: 'anam_portal',
    user: 'postgres',
    password: ''
  }
];

async function createAdminWithConfig(config: any, configIndex: number) {
  const pool = new Pool({
    ...config,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log(`\n🔍 Tentativa ${configIndex + 1}: Conectando ao banco...`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user}`);

    // Testar conexão
    await pool.query('SELECT 1');

    console.log('✅ Conexão estabelecida!');
    console.log('🔐 Criando usuário admin...');

    // Hash da senha admin123
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Inserir ou atualizar usuário admin
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
      console.log('📝 Usuário admin criado/atualizado com sucesso!');
      console.log('\n📋 Credenciais de acesso:');
      console.log('   Email: admin');
      console.log('   Password: admin123');
      console.log('   Role: admin (todas as permissões)');
      console.log(`   ID: ${user.id}`);
      console.log(`   Status: ${user.active ? 'Ativo' : 'Inativo'}`);
      console.log('\n🎉 Agora você pode fazer login e testar o sistema!');
      
      await pool.end();
      return true;
    }

    await pool.end();
    return false;
  } catch (error: any) {
    if (error.code === '28P01') {
      console.log('❌ Erro de autenticação - senha incorreta');
    } else if (error.code === '3D000') {
      console.log('❌ Banco de dados não existe');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('❌ Não foi possível conectar ao servidor PostgreSQL');
    } else if (error.code === '42P01') {
      console.log('❌ Tabela users não existe - execute primeiro: npm run db:migrate');
    } else {
      console.log(`❌ Erro: ${error.message}`);
    }
    await pool.end();
    return false;
  }
}

async function createAdmin() {
  console.log('========================================');
  console.log('  Criar Usuário Admin Automaticamente');
  console.log('========================================\n');

  // Tentar cada configuração
  for (let i = 0; i < defaultConfigs.length; i++) {
    const success = await createAdminWithConfig(defaultConfigs[i], i);
    if (success) {
      process.exit(0);
    }
  }

  // Se todas as tentativas falharam
  console.log('\n❌ Não foi possível criar o usuário admin automaticamente.');
  console.log('\n📝 Opções:');
  console.log('1. Crie um arquivo .env na pasta backend com as configurações do banco:');
  console.log('   DB_HOST=localhost');
  console.log('   DB_PORT=5432');
  console.log('   DB_NAME=anam_portal');
  console.log('   DB_USER=postgres');
  console.log('   DB_PASSWORD=sua_senha');
  console.log('\n2. Execute manualmente o arquivo create-admin.sql no pgAdmin');
  console.log('\n3. Certifique-se de que:');
  console.log('   - PostgreSQL está rodando');
  console.log('   - O banco anam_portal existe');
  console.log('   - As tabelas foram criadas (npm run db:migrate)');
  
  process.exit(1);
}

createAdmin();

