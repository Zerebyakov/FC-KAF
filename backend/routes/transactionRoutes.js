import express from 'express'
import { requireAdminAuth, requireAuth } from '../middleware/AuthMiddleware.js';
import { createTransaction, getAllTransactions, getTransactionById, getUserTransactions, updateTransactionStatus } from '../controllers/TransactionController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';


const router = express.Router();



router.post('/', requireAuth, createTransaction);
router.get('/my-order', requireAuth, getUserTransactions);
router.get('/detail/:id', requireAuth, getTransactionById);

// admin rute
router.get('/',
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_ORDERS),
    getAllTransactions
)

router.get('/admin/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_ORDERS),
    getTransactionById
)

router.put('/:id/status',
    requireAdminAuth,
    checkPermission(PERMISSIONS.UPDATE_ORDER_STATUS),
    adminActionLogger('UPDATE_ORDER_STATUS'),
    updateTransactionStatus
)

export default router;