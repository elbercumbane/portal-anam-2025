import bcrypt from 'bcryptjs';
import { Pool, Client } from 'pg';
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

    // Ler schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📋 Lendo schema.sql...');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir em comandos individuais (separados por ;)
    const commands = schemaSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Executando ${commands.length} comandos SQL...\n`);

    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      if (cmd.trim().length === 0) continue;
      
      try {
        // Pular comentários
        if (cmd.trim().startsWith('--')) continue;
        
        await pool.query(cmd);
        console.log(`✅ Comando ${i + 1}/${commands.length} executado`);
      } catch (error: any) {
        // Ignorar erros de "já existe" ou "não existe"
        if (error.code === '42P07' || error.code === '42710' || error.message.includes('already exists')) {
          console.log(`⚠️  Comando ${i + 1}: ${error.message.split('\n')[0]}`);
        } else if (error.code === '42P01' && cmd.includes('DROP')) {
          // Ignorar erros de DROP em tabelas que não existem
          console.log(`⚠️  Comando ${i + 1}: Tabela não existe (ok)`);
        } else {
          console.log(`❌ Erro no comando ${i + 1}: ${error.message.split('\n')[0]}`);
          // Continuar mesmo com erro
        }
      }
    }

    console.log('\n✅ Schema executado!\n');

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
    }

    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (pool) {
      await pool.end();
    }
    process.exit(1);
  }
}

createAll();

