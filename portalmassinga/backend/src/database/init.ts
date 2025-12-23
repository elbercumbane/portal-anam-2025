import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
  };

  const dbName = process.env.DB_NAME || 'anam_portal';

  // Tentar diferentes senhas
  const passwords = [
    process.env.DB_PASSWORD,
    'postgres',
    '',
    'admin',
    'root',
    '123456',
    'Cedsif2035'
  ].filter(p => p !== undefined);

  let adminClient: Client | null = null;
  let connected = false;

  for (const password of passwords) {
    try {
      console.log(`🔄 Tentando conectar ao PostgreSQL (senha: ${password ? '***' : 'vazia'})...`);
      adminClient = new Client({
        ...dbConfig,
        password: password || '',
        database: 'postgres'
      });
      
      await adminClient.connect();
      console.log('✅ Conexão estabelecida!');
      connected = true;
      break;
    } catch (error: any) {
      if (adminClient) {
        try { await adminClient.end(); } catch {}
      }
      continue;
    }
  }

  if (!connected || !adminClient) {
    console.error('❌ Não foi possível conectar ao PostgreSQL com nenhuma senha testada.');
    console.log('\n💡 Por favor:');
    console.log('   1. Verifique se o PostgreSQL está rodando');
    console.log('   2. Configure a senha correta no arquivo .env (DB_PASSWORD)');
    console.log('   3. Execute novamente: npm run db:init');
    process.exit(1);
  }

  try {

    // Verificar se o database existe
    const dbCheckResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`📦 Criando database '${dbName}'...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' criado com sucesso!`);
    } else {
      console.log(`✅ Database '${dbName}' já existe.`);
    }

    await adminClient.end();

    // Conectar ao database criado para executar schema
    // Usar a senha que funcionou
    const workingPassword = passwords.find(p => {
      try {
        const testClient = new Client({ ...dbConfig, password: p || '', database: 'postgres' });
        testClient.connect();
        testClient.end();
        return true;
      } catch {
        return false;
      }
    }) || '';

    const dbClient = new Client({
      ...dbConfig,
      password: workingPassword,
      database: dbName
    });

    await dbClient.connect();
    console.log(`🔄 Executando schema SQL...`);

    // Ler e executar schema.sql
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await dbClient.query(sql);
    console.log('✅ Schema executado com sucesso!');

    await dbClient.end();

    console.log('\n✅ Inicialização do banco de dados concluída!');
    console.log('💡 Execute "npm run db:seed" para popular com dados iniciais.');
  } catch (error: any) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    process.exit(1);
  }
}

initDatabase();

