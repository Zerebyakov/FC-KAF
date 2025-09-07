import express from 'express';
import { requireAdminAuth, requireAdminRole } from '../middleware/AuthMiddleware.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';
import { createAdmin, getAllAdmins, updateAdmin } from '../controllers/AdminController.js';



const router = express.Router();

router.use(requireAdminAuth);
router.post('/',
    requireAdminRole,
    checkPermission(PERMISSIONS.CREATE_ADMIN),
    adminActionLogger('CREATE_ADMIN'),
    createAdmin
)
router.get('/',
    checkPermission(PERMISSIONS.VIEW_ADMIN),
    getAllAdmins
)

router.put('/:id',
    requireAdminRole,
    checkPermission(PERMISSIONS.EDIT_ADMIN),
    adminActionLogger('UPDATE_ADMIN'),
    updateAdmin
)

export default router;