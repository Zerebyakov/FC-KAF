import express from 'express'


import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import addonRoutes from "./addonRoutes.js";
import reportRoutes from "./reportRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import paymentRoutes from './paymentRoutes.js';
import addressRoutes from './addressRoute.js';

import { requestLogger } from '../middleware/LoggerMiddleware.js';



const router = express.Router();

router.use(requestLogger)

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment:'development'
    });
})


// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/transactions', transactionRoutes);
router.use('/addons', addonRoutes);
router.use('/addresses',addressRoutes);
router.use('/reports', reportRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payments', paymentRoutes);

export default router;
