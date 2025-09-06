import express from 'express'
import { requireAdminAuth } from '../middleware/AuthMiddleware.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { getDailySalesReport, getInventoryReport, getMonthlySalesReport } from '../controllers/ReportController.js';


const router = express.Router();



router.use(requireAdminAuth);
router.use(checkPermission(PERMISSIONS.VIEW_REPORTS));


router.get('/reports/daily-sales', getDailySalesReport);
router.get('/reports/monthly-sales', getMonthlySalesReport);
router.get('/reports/inventory', getInventoryReport);


export default router;
