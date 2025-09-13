import express from 'express';
import { optionalAuth, requireAdminAuth } from '../middleware/AuthMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, updateStock } from '../controllers/ProductController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}
const storage = multer.diskStorage({
    destination: (req, res, cb) => { cb(null, 'uploads/products/') },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'product-' + uniqueSuffix + ext)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //maks 5mb
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});


router.get('/', optionalAuth, getAllProducts);
router.get('/:id', optionalAuth, getProductById);

// Rute admin
router.post('/',
    upload.single('image_url'),
    requireAdminAuth,
    checkPermission(PERMISSIONS.CREATE_PRODUCT),
    adminActionLogger('CREATE_PRODUCT'),
    createProduct
)

router.put('/:id/upload',
    upload.single('image_url'),
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

router.delete('/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.DELETE_PRODUCT),
    adminActionLogger('DELETE_PRODUCT'),
    deleteProduct
)

export default router;