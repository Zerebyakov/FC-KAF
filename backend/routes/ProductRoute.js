import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/ProductController.js';
import { isAdmin, isAunthenticated } from '../middleware/Auth.js';


const router = express.Router();

router.get('/product', getAllProducts)
router.post('/product',isAunthenticated,isAdmin, createProduct)
router.patch('/product/:product_id', isAunthenticated,isAdmin,updateProduct)
router.delete('/product/:product_id',isAunthenticated,isAdmin, deleteProduct)
router.get('/product/:product_id', getProductById)


export default router