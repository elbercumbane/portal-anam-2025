import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function resetPassword() {
  console.log('=== Redefinindo Senha do PostgreSQL ===\n');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
  };

  // Tentar conectar sem senha primeiro (se pg_hba.conf permitir)
  const passwords = ['', 'postgres', 'admin', 'root'];
  
  let connected = false;
  let workingPassword = '';
  let client: Client | null = null;

  for (const password of passwords) {
    try {
      console.log(`Tentando conectar com senha: ${password || '(vazia)'}...`);
      client = new Client({
        ...dbConfig,
        password: password,
        database: 'postgres'
      });
      
      await client.connect();
      console.log('✅ Conectado!');
      connected = true;
      workingPassword = password;
      break;
    } catch (error: any) {
      if (client) {
        try { await client.end(); } catch {}
      }
      continue;
    }
  }

  if (!connected) {
    console.log('\n❌ Não foi possível conectar.');
    console.log('\n💡 Vamos tentar modificar temporariamente o pg_hba.conf para permitir conexão sem senha...');
    console.log('   Isso permitirá redefinir a senha.');
    
    const pgHbaPath = 'C:\\Program Files\\PostgreSQL\\18\\data\\pg_hba.conf';
    
    if (fs.existsSync(pgHbaPath)) {
      console.log('\n⚠️  ATENÇÃO: Vamos modificar o arquivo pg_hba.conf temporariamente.');
      console.log('   Isso requer privilégios de administrador.');
      console.log('\n   Passos manuais:');
      console.log('   1. Pare o serviço PostgreSQL:');
      console.log('      Stop-Service postgresql-x64-18');
      console.log('   2. Edite o arquivo:');
      console.log(`      ${pgHbaPath}`);
      console.log('   3. Altere a linha que contém "md5" para "trust":');
      console.log('      De: host    all    all    127.0.0.1/32    md5');
      console.log('      Para: host    all    all    127.0.0.1/32    trust');
      console.log('   4. Salve o arquivo');
      console.log('   5. Inicie o serviço:');
      console.log('      Start-Service postgresql-x64-18');
      console.log('   6. Execute este script novamente');
      console.log('   7. Após redefinir a senha, reverta o pg_hba.conf para "md5"');
    }
    
    process.exit(1);
  }

  // Se conectou, definir nova senha
  const newPassword = 'postgres'; // Senha padrão simples
  console.log(`\n🔐 Redefinindo senha para: ${newPassword}`);
  
  try {
    await client!.query(`ALTER USER postgres PASSWORD '${newPassword}';`);
    console.log('✅ Senha redefinida com sucesso!');
    
    // Atualizar .env
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${newPassword}`);
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Arquivo .env atualizado!');
    }
    
    await client!.end();
    
    console.log('\n✅ Pronto! Agora você pode usar a senha: postgres');
    console.log('\nExecute: npm run db:init');
    
  } catch (error: any) {
    console.error('❌ Erro ao redefinir senha:', error.message);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

resetPassword();











