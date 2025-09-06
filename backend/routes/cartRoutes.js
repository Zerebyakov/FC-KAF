import express from 'express';
import { requireAuth } from '../middleware/AuthMiddleware.js';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController.js';



const router = express.Router();

router.use(requireAuth);
router.get('/cart', getCart);
router.post('/cart/add', addToCart);
router.put('/cart/item/:id', updateCartItem)
router.delete('/cart/item/:id', removeFromCart)
router.delete('/cart/clear', clearCart)


export default router;