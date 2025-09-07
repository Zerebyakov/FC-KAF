import express from 'express';
import { requireAuth } from '../middleware/AuthMiddleware.js';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController.js';



const router = express.Router();

router.use(requireAuth);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem)
router.delete('/item/:id', removeFromCart)
router.delete('/clear', clearCart)


export default router;