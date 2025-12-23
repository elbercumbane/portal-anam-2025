import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres'
  };

  console.log('🔍 Testando conexão com PostgreSQL...');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : '(não definida)'}`);

  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    // Testar se consegue criar database
    const dbName = process.env.DB_NAME || 'anam_portal';
    const dbCheck = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    
    if (dbCheck.rows.length === 0) {
      console.log(`📦 Database '${dbName}' não existe. Pode ser criado.`);
    } else {
      console.log(`✅ Database '${dbName}' já existe.`);
    }
    
    await client.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao conectar:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('   1. Verifique se a senha do PostgreSQL está correta no arquivo .env');
    console.log('   2. Verifique se o PostgreSQL está rodando');
    console.log('   3. Tente alterar DB_PASSWORD no arquivo .env');
    await client.end();
    process.exit(1);
  }
}

testConnection();

