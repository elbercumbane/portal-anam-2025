import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

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

    console.log('📋 Criando extensões e tabelas...\n');

    // 1. Criar extensão UUID
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      console.log('✅ Extensão uuid-ossp criada');
    } catch (e: any) {
      if (!e.message.includes('already exists')) console.log('⚠️  Extensão:', e.message);
    }

    // 2. Criar tabela members primeiro (sem foreign keys)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS members (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nome VARCHAR(255) NOT NULL,
          nome_pai VARCHAR(255) NOT NULL,
          nome_mae VARCHAR(255) NOT NULL,
          data_nascimento DATE NOT NULL,
          estado_civil VARCHAR(50) NOT NULL,
          profissao VARCHAR(255) NOT NULL,
          celular VARCHAR(20) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          telefone VARCHAR(20),
          rua VARCHAR(255) NOT NULL,
          bairro VARCHAR(255) NOT NULL,
          cidade VARCHAR(255) NOT NULL,
          nome_conjuge VARCHAR(255),
          data_nascimento_conjuge DATE,
          filiacao_pai_conjuge VARCHAR(255),
          filiacao_mae_conjuge VARCHAR(255),
          local_trabalho VARCHAR(255),
          cargo VARCHAR(255),
          endereco_trabalho VARCHAR(255),
          telefone_trabalho VARCHAR(20),
          foto TEXT,
          outras_informacoes TEXT,
          status VARCHAR(50) DEFAULT 'Ativo',
          data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_aprovacao TIMESTAMP,
          application_id UUID,
          created_by UUID,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabela members criada');
    } catch (e: any) {
      if (!e.message.includes('already exists')) console.log('⚠️  Members:', e.message);
    }

    // 3. Criar tabela member_applications
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS member_applications (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nome VARCHAR(255) NOT NULL,
          nome_pai VARCHAR(255) NOT NULL,
          nome_mae VARCHAR(255) NOT NULL,
          data_nascimento DATE NOT NULL,
          estado_civil VARCHAR(50) NOT NULL,
          profissao VARCHAR(255) NOT NULL,
          celular VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL,
          telefone VARCHAR(20),
          rua VARCHAR(255) NOT NULL,
          bairro VARCHAR(255) NOT NULL,
          cidade VARCHAR(255) NOT NULL,
          nome_conjuge VARCHAR(255),
          data_nascimento_conjuge DATE,
          filiacao_pai_conjuge VARCHAR(255),
          filiacao_mae_conjuge VARCHAR(255),
          local_trabalho VARCHAR(255),
          cargo VARCHAR(255),
          endereco_trabalho VARCHAR(255),
          telefone_trabalho VARCHAR(20),
          foto TEXT,
          outras_informacoes TEXT,
          aceita_termos BOOLEAN NOT NULL DEFAULT false,
          status VARCHAR(50) DEFAULT 'Pendente',
          data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_aprovacao TIMESTAMP,
          aprovado_por UUID,
          observacoes TEXT
        )
      `);
      console.log('✅ Tabela member_applications criada');
    } catch (e: any) {
      if (!e.message.includes('already exists')) console.log('⚠️  Applications:', e.message);
    }

    // 4. Criar tabela users (agora pode referenciar members)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'membro',
          department VARCHAR(100),
          province VARCHAR(100),
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          member_id UUID REFERENCES members(id) ON DELETE SET NULL
        )
      `);
      console.log('✅ Tabela users criada');
    } catch (e: any) {
      if (!e.message.includes('already exists')) console.log('⚠️  Users:', e.message);
    }

    // 5. Adicionar foreign keys que faltam
    try {
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'member_applications_aprovado_por_fkey'
          ) THEN
            ALTER TABLE member_applications 
            ADD CONSTRAINT member_applications_aprovado_por_fkey 
            FOREIGN KEY (aprovado_por) REFERENCES users(id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'members_application_id_fkey'
          ) THEN
            ALTER TABLE members 
            ADD CONSTRAINT members_application_id_fkey 
            FOREIGN KEY (application_id) REFERENCES member_applications(id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'members_created_by_fkey'
          ) THEN
            ALTER TABLE members 
            ADD CONSTRAINT members_created_by_fkey 
            FOREIGN KEY (created_by) REFERENCES users(id);
          END IF;
        END $$;
      `);
      console.log('✅ Foreign keys adicionadas');
    } catch (e: any) {
      console.log('⚠️  Foreign keys:', e.message);
    }

    console.log('\n✅ Todas as tabelas criadas!\n');

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
      console.log('  4. Login com: admin / admin123');
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

