const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'anam_portal';
  
  // Tentar diferentes configurações de senha
  const configs = [
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: 'postgres'
    },
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: '',
      database: 'postgres'
    }
  ];

  for (const config of configs) {
    try {
      console.log(`Tentando conectar com senha: ${config.password ? '***' : '(vazia)'}...`);
      const adminClient = new Client(config);
      await adminClient.connect();
      console.log('✅ Conexão estabelecida!');

      // Verificar se database existe
      const checkResult = await adminClient.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );

      if (checkResult.rows.length === 0) {
        console.log(`Criando database '${dbName}'...`);
        await adminClient.query(`CREATE DATABASE ${dbName}`);
        console.log('✅ Database criado com sucesso!');
      } else {
        console.log('✅ Database já existe.');
      }

      await adminClient.end();

      // Conectar ao database criado e executar schema
      const dbConfig = { ...config, database: dbName };
      const dbClient = new Client(dbConfig);
      await dbClient.connect();
      console.log('Executando schema...');

      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await dbClient.query(schema);
      
      console.log('✅ Schema executado com sucesso!');
      await dbClient.end();
      
      console.log('');
      console.log('✅ Banco de dados configurado completamente!');
      return true;
    } catch (error) {
      console.log(`❌ Falhou: ${error.message}`);
      continue;
    }
  }
  
  console.log('');
  console.log('❌ Não foi possível conectar ao PostgreSQL.');
  console.log('Por favor, verifique as credenciais no arquivo .env');
  return false;
}

createDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
