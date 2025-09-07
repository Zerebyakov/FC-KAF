import express from 'express'
import { getMe, loginAdmin, loginUser, logout } from '../controllers/AuthController.js';
import { requireUserOrAdmin } from '../middleware/AuthMiddleware.js';



const router = express.Router();

router.post('/login/user', loginUser)
router.post('/login/admin', loginAdmin)

router.get('/me', requireUserOrAdmin, getMe);
router.post('/logout', requireUserOrAdmin, logout)

export default router;