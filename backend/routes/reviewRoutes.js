import express from 'express'
import { optionalAuth, requireAdminAuth, requireAuth } from '../middleware/AuthMiddleware.js';
import { createReview, getAverageRating, getReviews } from '../controllers/ReviewController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';



const router = express.Router();


router.get('/average', optionalAuth, getAverageRating);
router.post('/', requireAuth, createReview)
router.get('/', 
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_REPORTS),
    getReviews
)

export default router;