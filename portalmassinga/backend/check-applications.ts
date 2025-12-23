import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

// Carregar .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'anam_portal',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function checkApplications() {
  try {
    console.log('🔍 Verificando candidaturas na base de dados...\n');
    
    // Contar total
    const count = await pool.query('SELECT COUNT(*) as total FROM member_applications');
    console.log(`📊 Total de candidaturas: ${count.rows[0].total}\n`);
    
    if (parseInt(count.rows[0].total) === 0) {
      console.log('⚠️  Nenhuma candidatura encontrada na base de dados!');
      console.log('💡 Verifique se:');
      console.log('   1. O formulário está enviando os dados corretamente');
      console.log('   2. O backend está recebendo as requisições');
      console.log('   3. Não há erros silenciosos no backend\n');
      await pool.end();
      process.exit(0);
    }
    
    // Listar todas as candidaturas
    const all = await pool.query(`
      SELECT 
        id, 
        nome, 
        email, 
        celular,
        status, 
        data_cadastro,
        aceita_termos
      FROM member_applications 
      ORDER BY data_cadastro DESC
    `);
    
    console.log('📋 Todas as candidaturas:\n');
    all.rows.forEach((app, index) => {
      console.log(`${index + 1}. ${app.nome}`);
      console.log(`   Email: ${app.email}`);
      console.log(`   Celular: ${app.celular || '-'}`);
      console.log(`   Status: ${app.status || 'Pendente'}`);
      console.log(`   Data: ${app.data_cadastro || '-'}`);
      console.log(`   Aceita termos: ${app.aceita_termos ? 'Sim' : 'Não'}`);
      console.log(`   ID: ${app.id}`);
      console.log('');
    });
    
    // Verificar por status
    const byStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM member_applications 
      GROUP BY status
    `);
    
    console.log('📊 Candidaturas por status:');
    byStatus.rows.forEach(row => {
      console.log(`   ${row.status || 'NULL'}: ${row.count}`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao verificar candidaturas:');
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    await pool.end();
    process.exit(1);
  }
}

checkApplications();










