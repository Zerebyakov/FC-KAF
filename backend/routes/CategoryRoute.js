import express from 'express'
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controllers/CategoryController.js';
import { isAdmin, isAunthenticated } from '../middleware/Auth.js';



const router = express.Router();

router.get('/category', getAllCategory)
router.post('/category', isAunthenticated, isAdmin, createCategory)
router.patch('/category/:category_id', isAunthenticated, isAdmin, updateCategory)
router.delete('/category/:category_id', isAunthenticated, isAdmin, deleteCategory)
router.get('/category/:category_id', getCategoryById)


export default router;


