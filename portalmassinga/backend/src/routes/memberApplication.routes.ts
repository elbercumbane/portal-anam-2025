import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication
} from '../controllers/memberApplication.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Middleware de log específico para esta rota
router.use((req, res, next) => {
  console.log('🔵 Rota member-applications:', req.method, req.path);
  next();
});

// Público - qualquer um pode criar candidatura
router.post('/', async (req, res, next) => {
  console.log('🟢 POST /member-applications - Chamando createApplication');
  try {
    await createApplication(req, res);
  } catch (error) {
    console.error('❌ Erro capturado na rota:', error);
    next(error);
  }
});

// Protegido - apenas autenticados podem ver candidaturas
router.get('/', authenticateToken, getApplications);
router.get('/:id', authenticateToken, getApplicationById);

// Apenas admin pode aprovar/rejeitar
router.put('/:applicationId/approve', authenticateToken, requireRole('admin'), approveApplication);
router.put('/:applicationId/reject', authenticateToken, requireRole('admin'), rejectApplication);

export default router;

