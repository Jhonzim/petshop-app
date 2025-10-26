import { Router } from 'express';
import { handleLogin } from '../controllers/authController';
import { validateBody } from '../middlewares/validate';
import { loginSchema } from '../validations/authSchemas';

const router = Router();

router.post('/login', validateBody(loginSchema), handleLogin);

export default router;
