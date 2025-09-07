import express from 'express';
import { requireAdminAuth, requireAuth } from '../middleware/AuthMiddleware.js';
import { confirmPayment, getPaymentDetails, getTransactionsByPaymentStatus, markCashReceived, updatePaymentStatus } from '../controllers/PaymentController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';




const router = express.Router();


router.post('/',
    requireAuth,
    confirmPayment
)

router.get('/details/:transaction_id', requireAuth, getPaymentDetails);

router.get('/status/:payment_status',
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_ORDERS),
    getTransactionsByPaymentStatus
)

router.put('/update/:transaction_id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.UPDATE_ORDER_STATUS),
    updatePaymentStatus
);

router.post('/cash-received/:transaction_id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.UPDATE_ORDER_STATUS),
    markCashReceived
)


export default router;