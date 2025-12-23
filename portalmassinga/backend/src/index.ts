import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env ANTES de importar outros módulos
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Importar pool DEPOIS de carregar .env
import pool from './config/database';

// Routes
import authRoutes from './routes/auth.routes';
import memberApplicationRoutes from './routes/memberApplication.routes';
import memberRoutes from './routes/member.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

// Middleware CORS - aceitar múltiplas origens em desenvolvimento
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:4201',
  CORS_ORIGIN
].filter((origin, index, self) => self.indexOf(origin) === index); // Remove duplicatas

app.use(cors({
  origin: (origin, callback) => {
    // Em desenvolvimento, aceitar qualquer origem localhost ou ngrok
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        origin.includes('ngrok-free.dev') ||
        origin.includes('ngrok.io')) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware de log para todas as requisições
app.use((req: Request, res: Response, next: any) => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📥 ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  console.log('═══════════════════════════════════════════════════════');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Error handler global
app.use((err: any, req: Request, res: Response, next: any) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

