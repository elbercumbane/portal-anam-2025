import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validação de login
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validação de criação de candidatura
export const validateApplication = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('nome_pai').notEmpty().withMessage('Nome do pai é obrigatório'),
  body('nome_mae').notEmpty().withMessage('Nome da mãe é obrigatório'),
  body('data_nascimento').isISO8601().withMessage('Data de nascimento inválida'),
  body('estado_civil').notEmpty().withMessage('Estado civil é obrigatório'),
  body('profissao').notEmpty().withMessage('Profissão é obrigatória'),
  body('celular').notEmpty().withMessage('Celular é obrigatório'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('rua').notEmpty().withMessage('Rua é obrigatória'),
  body('bairro').notEmpty().withMessage('Bairro é obrigatório'),
  body('cidade').notEmpty().withMessage('Cidade é obrigatória'),
  body('aceita_termos')
    .custom((value) => {
      return value === true || value === 'true' || value === 1;
    })
    .withMessage('Deve aceitar os termos'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }
    next();
  }
];

