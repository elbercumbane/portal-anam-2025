import { Request, Response } from 'express';
import pool from '../config/database';
import { Member } from '../types';

// Listar todos os membros
export const getMembers = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    let query = 'SELECT * FROM members WHERE 1=1';
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

    const result = await pool.query(query, params);

    // Buscar dependentes para cada membro
    const membersWithDependents = await Promise.all(
      result.rows.map(async (member) => {
        const dependentsResult = await pool.query(
          'SELECT * FROM dependents WHERE member_id = $1',
          [member.id]
        );
        return {
          ...member,
          dependentes: dependentsResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: membersWithDependents,
      count: membersWithDependents.length
    });
  } catch (error: any) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar membros',
      error: error.message
    });
  }
};

// Buscar membro por ID
export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const memberResult = await pool.query(
      'SELECT * FROM members WHERE id = $1',
      [id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    const member = memberResult.rows[0];

    // Buscar dependentes
    const dependentsResult = await pool.query(
      'SELECT * FROM dependents WHERE member_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...member,
        dependentes: dependentsResult.rows
      }
    });
  } catch (error: any) {
    console.error('Get member by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar membro',
      error: error.message
    });
  }
};

// Atualizar membro
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar se membro existe
    const memberResult = await pool.query(
      'SELECT id FROM members WHERE id = $1',
      [id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    // Construir query de atualização dinamicamente
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const allowedFields = [
      'nome', 'nome_pai', 'nome_mae', 'data_nascimento', 'estado_civil', 'profissao',
      'celular', 'email', 'telefone', 'rua', 'bairro', 'cidade',
      'nome_conjuge', 'data_nascimento_conjuge', 'filiacao_pai_conjuge', 'filiacao_mae_conjuge',
      'local_trabalho', 'cargo', 'endereco_trabalho', 'telefone_trabalho',
      'foto', 'outras_informacoes', 'status'
    ];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    updateFields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    paramCount++;

    values.push(id);

    const updateQuery = `
      UPDATE members
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Membro atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar membro',
      error: error.message
    });
  }
};

// Deletar membro (soft delete - apenas desativa)
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE members
      SET status = 'Inativo', updated_at = $1
      WHERE id = $2
      RETURNING *
    `, [new Date(), id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Membro não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Membro desativado com sucesso',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao desativar membro',
      error: error.message
    });
  }
};

