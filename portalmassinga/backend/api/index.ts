import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Importar pool de conexão
import pool from '../src/config/database';

// Routes
import authRoutes from '../src/routes/auth.routes';
import memberApplicationRoutes from '../src/routes/memberApplication.routes';
import memberRoutes from '../src/routes/member.routes';

const app = express();

// CORS - aceitar requisições do frontend Vercel
const allowedOrigins = [
  process.env.CORS_ORIGIN || '',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.FRONTEND_URL || '',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origem (mobile apps, Postman, etc)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Permitir se estiver na lista de origens permitidas ou se for do Vercel
    if (
      allowedOrigins.some(allowed => origin.includes(allowed)) ||
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/member-applications', memberApplicationRoutes);
app.use('/api/members', memberRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    code: err.code,
    path: req.path
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// Exportar como serverless function do Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};

