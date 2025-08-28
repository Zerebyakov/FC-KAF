import express from 'express'
import { Login, logOut, Me } from '../controllers/Auth.js';


const router = express.Router();

router.post('/auth/login', Login);
router.get('/auth/me', Me)
router.delete('/auth/logout', logOut)


export default router;
