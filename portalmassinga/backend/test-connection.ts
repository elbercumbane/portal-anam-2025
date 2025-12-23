import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

// Carregar .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('🔍 Verificando configuração do banco de dados...\n');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'anam_portal',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

console.log('📋 Configuração:');
console.log(`   Host: ${config.host}`);
console.log(`   Port: ${config.port}`);
console.log(`   Database: ${config.database}`);
console.log(`   User: ${config.user}`);
console.log(`   Password: ${config.password ? '***' : 'NOT SET'}\n`);

const pool = new Pool(config);

pool.query('SELECT 1')
  .then(() => {
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error(`   ${error.message}`);
    if (error.code === '28P01') {
      console.error('\n💡 Dica: Verifique se a senha no arquivo .env está correta.');
      console.error('   A senha atual configurada é:', config.password ? '***' : 'NOT SET');
    }
    process.exit(1);
  });

