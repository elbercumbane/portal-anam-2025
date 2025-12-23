import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { LoginRequest, LoginResponse } from '../types';
import { AppError, asyncHandler } from '../utils/errorHandler';

const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

export const login = asyncHandler(async (req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse>) => {
  const { email, password } = req.body;

  // Validação básica (validação completa feita pelo middleware)
  if (!email || !password) {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  // Buscar usuário no banco
  const userResult = await pool.query(
    'SELECT id, email, password_hash, full_name, role, active, member_id FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  if (userResult.rows.length === 0) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  const user = userResult.rows[0];

  if (!user.active) {
    throw new AppError('Conta desativada. Entre em contato com o administrador.', 403);
  }

  // Verificar senha
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  // Gerar token JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  // Buscar dados do membro se existir (opcional, não bloqueia o login)
  let memberData = null;
  try {
    if (user.member_id) {
      const memberResult = await pool.query(
        'SELECT id, nome, email FROM members WHERE id = $1',
        [user.member_id]
      );
      if (memberResult.rows.length > 0) {
        memberData = memberResult.rows[0];
      }
    }
  } catch (error) {
    // Ignorar erro ao buscar membro, não é crítico para o login
    console.warn('Erro ao buscar dados do membro:', error);
  }

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      nome: user.full_name,
      role: user.role,
      memberId: user.member_id || memberData?.id
    }
  });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const userId = authReq.user?.id;

  if (!userId) {
    throw new AppError('Não autenticado', 401);
  }

  const result = await pool.query(
    'SELECT id, email, full_name, role, department, province, active, member_id FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const user = result.rows[0];

  // Buscar dados do membro se existir (opcional)
  let memberData = null;
  try {
    if (user.member_id) {
      const memberResult = await pool.query(
        'SELECT * FROM members WHERE id = $1',
        [user.member_id]
      );
      if (memberResult.rows.length > 0) {
        memberData = memberResult.rows[0];
      }
    }
  } catch (error) {
    // Ignorar erro ao buscar membro
    console.warn('Erro ao buscar dados do membro:', error);
  }

  res.json({
    success: true,
    user: {
      ...user,
      member: memberData
    }
  });
});

