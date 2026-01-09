import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController()

router.get('/', authenticate, userController.getusers)

export default router;