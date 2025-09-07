import express from 'express';
import { optionalAuth, requireAdminAuth } from '../middleware/AuthMiddleware.js';
import { createAddon, deleteAddon, getAddonsByProduct, updateAddon } from '../controllers/ProductAddonController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';


const router = express.Router();

router.get('/product/:id',
    optionalAuth,
    getAddonsByProduct
)
router.post('/',
    requireAdminAuth,
    checkPermission(PERMISSIONS.CREATE_PRODUCT),
    adminActionLogger('CREATE_ADDON'),
    createAddon
)
router.put('/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.EDIT_PRODUCT),
    adminActionLogger('UPDATE_ADDON'),
    updateAddon
)

router.delete('/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.DELETE_PRODUCT),
    adminActionLogger('DELETE_ADDON'),
    deleteAddon
)

export default router;