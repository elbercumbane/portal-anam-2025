import { Response } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (err: any, res: Response) => {
  const { statusCode = 500, message } = err;

  // Log do erro
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    code: err.code
  });

  res.status(statusCode).json({
    success: false,
    message: message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

