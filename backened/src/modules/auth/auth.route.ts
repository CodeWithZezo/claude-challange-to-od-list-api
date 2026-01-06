import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router()
const authController = new AuthController()

router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/refresh-token', authController.refreshToken);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);
router.post('/logout', authenticate,authController.logout);
router.post('/change-password', authenticate, authController.changePassword);
router.get('/profile', authenticate, authController.getProfile);
export default router;
