import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { MemberApplication, ApproveApplicationRequest } from '../types';
import { AuthRequest } from '../middleware/auth';

// Criar nova candidatura
export const createApplication = async (req: Request<{}, any, MemberApplication>, res: Response) => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('📥 FUNÇÃO createApplication CHAMADA');
  console.log('═══════════════════════════════════════════════════════');
  
  try {
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
    
    const applicationData = req.body;
    
    console.log('📥 Dados da candidatura:', {
      nome: applicationData.nome,
      email: applicationData.email,
      aceita_termos: applicationData.aceita_termos,
      tipo_aceita_termos: typeof applicationData.aceita_termos,
      total_campos: Object.keys(applicationData).length,
      campos: Object.keys(applicationData)
    });

    // Validar campos obrigatórios
    const requiredFields = ['nome', 'nome_pai', 'nome_mae', 'data_nascimento', 'estado_civil', 
                           'profissao', 'celular', 'email', 'rua', 'bairro', 'cidade', 'aceita_termos'];
    
    const missingFields: string[] = [];
    for (const field of requiredFields) {
      const value = applicationData[field as keyof MemberApplication];
      // Para aceita_termos, aceitar true, 'true', 1, ou qualquer valor truthy
      if (field === 'aceita_termos') {
        const aceitaTermos = value === true || value === 'true' || value === 1 || value === '1';
        if (!aceitaTermos) {
          missingFields.push(field);
          console.log(`   ❌ ${field}: valor inválido (${value}, tipo: ${typeof value})`);
        } else {
          console.log(`   ✅ ${field}: OK (${value})`);
        }
      } else {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(field);
          console.log(`   ❌ ${field}: faltando ou vazio`);
        } else {
          console.log(`   ✅ ${field}: OK`);
        }
      }
    }
    
    if (missingFields.length > 0) {
      console.error('❌ VALIDAÇÃO FALHOU - Campos obrigatórios faltando:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
      });
    }
    
    console.log('✅ Validação passou - todos os campos obrigatórios presentes');

    // Verificar se já existe candidatura com este email
    const existingApp = await pool.query(
      'SELECT id FROM member_applications WHERE email = $1 AND status = $2',
      [applicationData.email, 'Pendente']
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma candidatura pendente com este email'
      });
    }

    // Inserir candidatura
    console.log('💾 Tentando inserir candidatura no banco de dados...');
    console.log('📋 Dados a inserir:', {
      nome: applicationData.nome,
      email: applicationData.email,
      aceita_termos: applicationData.aceita_termos,
      campos_preenchidos: Object.keys(applicationData).filter(k => applicationData[k as keyof typeof applicationData])
    });
    
    const result = await pool.query(`
      INSERT INTO member_applications (
        nome, nome_pai, nome_mae, data_nascimento, estado_civil, profissao,
        celular, email, telefone, rua, bairro, cidade,
        nome_conjuge, data_nascimento_conjuge, filiacao_pai_conjuge, filiacao_mae_conjuge,
        local_trabalho, cargo, endereco_trabalho, telefone_trabalho,
        foto, outras_informacoes, aceita_termos, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *
    `, [
      applicationData.nome,
      applicationData.nome_pai,
      applicationData.nome_mae,
      applicationData.data_nascimento,
      applicationData.estado_civil,
      applicationData.profissao,
      applicationData.celular,
      applicationData.email,
      applicationData.telefone || null,
      applicationData.rua,
      applicationData.bairro,
      applicationData.cidade,
      applicationData.nome_conjuge || null,
      applicationData.data_nascimento_conjuge || null,
      applicationData.filiacao_pai_conjuge || null,
      applicationData.filiacao_mae_conjuge || null,
      applicationData.local_trabalho || null,
      applicationData.cargo || null,
      applicationData.endereco_trabalho || null,
      applicationData.telefone_trabalho || null,
      applicationData.foto || null,
      applicationData.outras_informacoes || null,
      // Garantir que aceita_termos seja boolean
      applicationData.aceita_termos === true || applicationData.aceita_termos === 'true' || applicationData.aceita_termos === 1 || applicationData.aceita_termos === '1',
      'Pendente'
    ]);

    const newApplication = result.rows[0];
    
    console.log('✅ Candidatura criada com sucesso:', {
      id: newApplication.id,
      nome: newApplication.nome,
      email: newApplication.email,
      status: newApplication.status
    });
    
    // Verificar se realmente foi inserida
    const verify = await pool.query(
      'SELECT id, nome, email, status FROM member_applications WHERE id = $1',
      [newApplication.id]
    );
    
    if (verify.rows.length === 0) {
      console.error('❌ ERRO CRÍTICO: Candidatura não foi encontrada após inserção!');
      throw new Error('Candidatura não foi inserida corretamente');
    }
    
    console.log('✅ Verificação: Candidatura confirmada no banco de dados');

    // Se houver dependentes, inserir na tabela de dependentes (após aprovação)
    // Por enquanto, apenas retornamos a candidatura

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ CANDIDATURA CRIADA COM SUCESSO');
    console.log('═══════════════════════════════════════════════════════');
    
    res.status(201).json({
      success: true,
      message: 'Candidatura criada com sucesso',
      data: newApplication
    });
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ ERRO AO CRIAR CANDIDATURA');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    console.error('Detalhes:', error.detail);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════════════════');
    
    res.status(500).json({
      success: false,
      message: 'Erro ao criar candidatura',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Listar todas as candidaturas (com filtros)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    
    console.log('📥 Buscando candidaturas:', { status, search });

    let query = 'SELECT * FROM member_applications WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (nome ILIKE $${paramCount} OR email ILIKE $${paramCount} OR celular ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY data_cadastro DESC';

    console.log('📋 Query SQL:', query);
    console.log('📋 Parâmetros:', params);

    const result = await pool.query(query, params);
    
    console.log(`✅ Candidaturas encontradas: ${result.rows.length}`);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error: any) {
    console.error('❌ Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar candidaturas',
      error: error.message
    });
  }
};

// Buscar candidatura por ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM member_applications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidatura não encontrada'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Get application by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar candidatura',
      error: error.message
    });
  }
};

// Aprovar candidatura (cria membro e usuário)
export const approveApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { observacoes } = req.body;
    const approvedBy = req.user?.id;

    if (!approvedBy) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    // Buscar candidatura
    const appResult = await pool.query(
      'SELECT * FROM member_applications WHERE id = $1',
      [applicationId]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidatura não encontrada'
      });
    }

    const application = appResult.rows[0];

    if (application.status !== 'Pendente') {
      return res.status(400).json({
        success: false,
        message: `Candidatura já foi ${application.status.toLowerCase()}`
      });
    }

    // Iniciar transação
    await pool.query('BEGIN');

    try {
      // Criar membro
      const memberResult = await pool.query(`
        INSERT INTO members (
          nome, nome_pai, nome_mae, data_nascimento, estado_civil, profissao,
          celular, email, telefone, rua, bairro, cidade,
          nome_conjuge, data_nascimento_conjuge, filiacao_pai_conjuge, filiacao_mae_conjuge,
          local_trabalho, cargo, endereco_trabalho, telefone_trabalho,
          foto, outras_informacoes, status, data_aprovacao, application_id, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        RETURNING *
      `, [
        application.nome,
        application.nome_pai,
        application.nome_mae,
        application.data_nascimento,
        application.estado_civil,
        application.profissao,
        application.celular,
        application.email,
        application.telefone,
        application.rua,
        application.bairro,
        application.cidade,
        application.nome_conjuge,
        application.data_nascimento_conjuge,
        application.filiacao_pai_conjuge,
        application.filiacao_mae_conjuge,
        application.local_trabalho,
        application.cargo,
        application.endereco_trabalho,
        application.telefone_trabalho,
        application.foto,
        application.outras_informacoes,
        'Ativo',
        new Date(),
        application.id,
        approvedBy
      ]);

      const newMember = memberResult.rows[0];

      // Criar usuário para login (senha padrão: membro123)
      const defaultPassword = await bcrypt.hash('membro123', 10);

      await pool.query(`
        INSERT INTO users (email, password_hash, full_name, role, active, member_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET member_id = $6
      `, [
        application.email,
        defaultPassword,
        application.nome,
        'membro',
        true,
        newMember.id
      ]);

      // Atualizar status da candidatura
      await pool.query(`
        UPDATE member_applications
        SET status = 'Aprovado', data_aprovacao = $1, aprovado_por = $2, observacoes = $3
        WHERE id = $4
      `, [new Date(), approvedBy, observacoes || null, applicationId]);

      await pool.query('COMMIT');

      res.json({
        success: true,
        message: 'Candidatura aprovada com sucesso',
        data: {
          member: newMember,
          application: {
            ...application,
            status: 'Aprovado',
            data_aprovacao: new Date()
          }
        }
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error: any) {
    console.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao aprovar candidatura',
      error: error.message
    });
  }
};

// Rejeitar candidatura
export const rejectApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { observacoes } = req.body;
    const rejectedBy = req.user?.id;

    if (!rejectedBy) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    const result = await pool.query(`
      UPDATE member_applications
      SET status = 'Rejeitado', observacoes = $1
      WHERE id = $2 AND status = 'Pendente'
      RETURNING *
    `, [observacoes || null, applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidatura não encontrada ou já processada'
      });
    }

    res.json({
      success: true,
      message: 'Candidatura rejeitada',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao rejeitar candidatura',
      error: error.message
    });
  }
};

