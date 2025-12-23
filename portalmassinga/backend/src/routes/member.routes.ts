import { Router } from 'express';
import {
  getMembers,
  getMemberById,
  updateMember,
  deleteMember
} from '../controllers/member.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', getMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', requireRole('admin'), deleteMember);

export default router;

