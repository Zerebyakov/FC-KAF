import express from 'express'
import { requireAdminAuth, requireAuth } from '../middleware/AuthMiddleware.js';
import { createTransaction, getAllTransactions, getTransactionById, getUserTransactions, updateTransactionStatus } from '../controllers/TransactionController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';


const router = express.Router();



router.post('/transactions', requireAuth, createTransaction);
router.get('/transactions/my-order', requireAuth, getUserTransactions);
router.get('/transactions/detail/:id', requireAuth, getTransactionById);

// admin rute
router.get('/transactions',
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_ORDERS),
    getAllTransactions
)

router.get('/transactions/admin/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_ORDERS),
    getTransactionById
)

router.put('/transactions/:id/status',
    requireAdminAuth,
    checkPermission(PERMISSIONS.UPDATE_ORDER_STATUS),
    adminActionLogger('UPDATE_ORDER_STATUS'),
    updateTransactionStatus
)

export default router;