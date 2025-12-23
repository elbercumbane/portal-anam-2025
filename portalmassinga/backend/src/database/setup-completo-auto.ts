import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Senhas comuns para tentar
const commonPasswords = ['elber123', 'postgres', '', 'admin', 'root', '123456', 'password'];

async function tryConnect(config: any): Promise<Pool | null> {
  const pool = new Pool({
    ...config,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  });

  try {
    await pool.query('SELECT 1');
    return pool;
  } catch (error) {
    await pool.end();
    return null;
  }
}

async function setupCompleto() {
  console.log('========================================');
  console.log('  Setup Completo Automático');
  console.log('========================================\n');

  // Criar .env se não existir
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('📝 Criando arquivo .env...');
    const envContent = `DB_HOST=localhost
DB_PORT=5432
DB_NAME=anam_portal
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:4200
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado\n');
    // Recarregar variáveis
    dotenv.config();
  }

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'anam_portal',
    user: process.env.DB_USER || 'postgres',
  };

  // Se não tiver senha no .env, usar elber123 como padrão
  if (!process.env.DB_PASSWORD) {
    process.env.DB_PASSWORD = 'elber123';
  }

  // Tentar conectar com diferentes senhas
  console.log('🔍 Tentando conectar ao PostgreSQL...');
  let pool: Pool | null = null;
  let workingPassword = '';

  // Tentar senha do .env primeiro
  if (process.env.DB_PASSWORD) {
    console.log(`   Tentando senha do .env...`);
    pool = await tryConnect({ ...config, password: process.env.DB_PASSWORD });
    if (pool) {
      workingPassword = process.env.DB_PASSWORD;
      console.log('✅ Conectado com senha do .env!\n');
    }
  }

  // Tentar senhas comuns
  if (!pool) {
    for (const password of commonPasswords) {
      console.log(`   Tentando senha: ${password || '(vazia)'}...`);
      pool = await tryConnect({ ...config, password });
      if (pool) {
        workingPassword = password;
        console.log(`✅ Conectado com senha: ${password || '(vazia)'}!\n`);
        // Atualizar .env
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${password || 'postgres'}`);
        fs.writeFileSync(envPath, envContent);
        break;
      }
    }
  }

  if (!pool) {
    console.log('❌ Não foi possível conectar ao PostgreSQL.');
    console.log('\n💡 Soluções:');
    console.log('1. Execute o script reset-postgres-password.ps1 como Administrador');
    console.log('2. Configure manualmente a senha no arquivo .env');
    console.log('3. Execute manualmente o SQL em create-admin.sql');
    process.exit(1);
  }

  try {
    // Verificar se banco existe, se não, criar
    console.log('📦 Verificando banco de dados...');
    try {
      await pool.query('SELECT 1');
      console.log('✅ Banco de dados existe');
    } catch (error: any) {
      if (error.code === '3D000') {
        console.log('📦 Criando banco de dados...');
        // Conectar ao postgres para criar o banco
        const adminPool = new Pool({
          ...config,
          password: workingPassword,
          database: 'postgres'
        });
        await adminPool.query(`CREATE DATABASE ${config.database}`);
        await adminPool.end();
        console.log('✅ Banco de dados criado');
      }
    }

    // Verificar se tabela users existe
    console.log('\n📋 Verificando tabelas...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('📋 Tabelas não existem. Execute: npm run db:migrate');
      console.log('   Ou execute o schema.sql manualmente');
    } else {
      console.log('✅ Tabelas existem');

      // Criar usuário admin
      console.log('\n🔐 Criando usuário admin...');
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
      }
    }

    await pool.end();

    console.log('\n========================================');
    console.log('  Setup Completo!');
    console.log('========================================');
    console.log('\n🎉 Agora você pode fazer login e testar!');
    console.log('\nPróximos passos:');
    console.log('  1. Backend: npm run dev');
    console.log('  2. Frontend: cd ../frontend && npm start');
    console.log('  3. Acesse: http://localhost:4200/login');
    console.log('');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  }
}

setupCompleto();

