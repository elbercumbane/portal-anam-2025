import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validateLogin } from '../middleware/validation';
import { handleError } from '../utils/errorHandler';

const router = Router();

router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getCurrentUser);

// Error handler para rotas de auth
router.use((err: any, req: any, res: any, next: any) => {
  handleError(err, res);
});

export default router;

