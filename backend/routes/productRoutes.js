import express from 'express';
import { optionalAuth, requireAdminAuth } from '../middleware/AuthMiddleware.js';
import { createProduct, getAllProducts, getProductById, updateProduct, updateStock } from '../controllers/ProductController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';


const router = express.Router();

router.get('/', optionalAuth, getAllProducts);
router.get('/:id', optionalAuth, getProductById);

// Rute admin
router.post('/',
    requireAdminAuth,checkPermission(PERMISSIONS.CREATE_PRODUCT),
    adminActionLogger('CREATE_PRODUCT'),
    createProduct
)

router.put('/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.EDIT_PRODUCT),
    adminActionLogger('UPDATE_PRODUCT'),
    updateProduct
)


router.put('/:id/stock',
    requireAdminAuth,
    checkPermission(PERMISSIONS.MANAGE_STOCK),
    adminActionLogger('UPDATE_STOCK'),
    updateStock
)

export default router;