import express from 'express';
import { optionalAuth, requireAdminAuth } from '../middleware/AuthMiddleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/CategoryController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';


const router = express.Router();

router.get('/categories', optionalAuth, getAllCategories);
router.get('/categories/:id', optionalAuth, getCategoryById);
// Admin rute
router.post('/categories',
    requireAdminAuth,
    checkPermission(PERMISSIONS.CREATE_CATEGORY),
    adminActionLogger('CREATE_CATEGORY'),
    createCategory
)

router.put('/categories/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.EDIT_CATEGORY),
    adminActionLogger('UPDATE_CATEGORY'),
    updateCategory
)

router.delete('/categories/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.DELETE_CATEGORY),
    adminActionLogger('DELETE_CATEGORY'),
    deleteCategory
)


export default router;