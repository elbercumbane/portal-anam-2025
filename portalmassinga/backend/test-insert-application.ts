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

async function testInsert() {
  try {
    console.log('🔍 Verificando se a tabela member_applications existe...\n');
    
    // Verificar se a tabela existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'member_applications'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('❌ Tabela member_applications NÃO existe!');
      console.log('💡 Execute o script de criação de tabelas primeiro.');
      process.exit(1);
    }
    
    console.log('✅ Tabela member_applications existe\n');
    
    // Verificar estrutura da tabela
    console.log('📋 Estrutura da tabela:');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'member_applications'
      ORDER BY ordinal_position;
    `);
    
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'})`);
    });
    
    console.log('\n🧪 Testando inserção de candidatura...\n');
    
    // Tentar inserir uma candidatura de teste
    const testApplication = {
      nome: 'Teste Usuario',
      nome_pai: 'Pai Teste',
      nome_mae: 'Mae Teste',
      data_nascimento: '1990-01-01',
      estado_civil: 'solteiro',
      profissao: 'Desenvolvedor',
      celular: '841234567',
      email: `teste${Date.now()}@teste.com`,
      telefone: null,
      rua: 'Rua Teste',
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      nome_conjuge: null,
      data_nascimento_conjuge: null,
      filiacao_pai_conjuge: null,
      filiacao_mae_conjuge: null,
      local_trabalho: null,
      cargo: null,
      endereco_trabalho: null,
      telefone_trabalho: null,
      foto: null,
      outras_informacoes: null,
      aceita_termos: true,
      status: 'Pendente'
    };
    
    const result = await pool.query(`
      INSERT INTO member_applications (
        nome, nome_pai, nome_mae, data_nascimento, estado_civil, profissao,
        celular, email, telefone, rua, bairro, cidade,
        nome_conjuge, data_nascimento_conjuge, filiacao_pai_conjuge, filiacao_mae_conjuge,
        local_trabalho, cargo, endereco_trabalho, telefone_trabalho,
        foto, outras_informacoes, aceita_termos, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING id, nome, email, status
    `, [
      testApplication.nome,
      testApplication.nome_pai,
      testApplication.nome_mae,
      testApplication.data_nascimento,
      testApplication.estado_civil,
      testApplication.profissao,
      testApplication.celular,
      testApplication.email,
      testApplication.telefone,
      testApplication.rua,
      testApplication.bairro,
      testApplication.cidade,
      testApplication.nome_conjuge,
      testApplication.data_nascimento_conjuge,
      testApplication.filiacao_pai_conjuge,
      testApplication.filiacao_mae_conjuge,
      testApplication.local_trabalho,
      testApplication.cargo,
      testApplication.endereco_trabalho,
      testApplication.telefone_trabalho,
      testApplication.foto,
      testApplication.outras_informacoes,
      testApplication.aceita_termos,
      testApplication.status
    ]);
    
    console.log('✅ Candidatura de teste inserida com sucesso!');
    console.log('   ID:', result.rows[0].id);
    console.log('   Nome:', result.rows[0].nome);
    console.log('   Email:', result.rows[0].email);
    console.log('   Status:', result.rows[0].status);
    
    // Verificar quantas candidaturas existem
    const count = await pool.query('SELECT COUNT(*) as total FROM member_applications');
    console.log(`\n📊 Total de candidaturas na base de dados: ${count.rows[0].total}`);
    
    // Listar últimas 5 candidaturas
    const recent = await pool.query(`
      SELECT id, nome, email, status, data_cadastro 
      FROM member_applications 
      ORDER BY data_cadastro DESC 
      LIMIT 5
    `);
    
    if (recent.rows.length > 0) {
      console.log('\n📋 Últimas candidaturas:');
      recent.rows.forEach((app, index) => {
        console.log(`   ${index + 1}. ${app.nome} (${app.email}) - ${app.status} - ${app.data_cadastro}`);
      });
    }
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao testar inserção:');
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    console.error('   Detalhes:', error.detail);
    console.error('   Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

testInsert();










