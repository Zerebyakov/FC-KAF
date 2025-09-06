import express from 'express'
import { getMe, loginAdmin, loginUser, logout } from '../controllers/AuthController.js';
import { requireUserOrAdmin } from '../middleware/AuthMiddleware.js';



const router = express.Router();

router.post('/auth/login/user', loginUser)
router.post('/auth/login/admin', loginAdmin)

router.get('/auth/me', requireUserOrAdmin, getMe);
router.post('/auth/logout', requireUserOrAdmin, logout)

export default router;