import express from 'express';
import { optionalAuth, requireAdminAuth } from '../middleware/AuthMiddleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/CategoryController.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';
import { adminActionLogger } from '../middleware/LoggerMiddleware.js';
import multer from 'multer';
import path from 'path'
import fs from 'fs'

const router = express.Router();

const uploadDir = 'uploads/category/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/category/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'category-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // maks 5mb
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

router.get('/', optionalAuth, getAllCategories);
router.get('/:id', optionalAuth, getCategoryById);
// Admin rute
router.post('/',
    upload.single('image_url'),
    requireAdminAuth,
    checkPermission(PERMISSIONS.CREATE_CATEGORY),
    adminActionLogger('CREATE_CATEGORY'),
    createCategory
)

router.put('/:id/upload',
    upload.single('image_url'),
    requireAdminAuth,
    checkPermission(PERMISSIONS.EDIT_CATEGORY),
    adminActionLogger('UPDATE_CATEGORY'),
    updateCategory
)

router.delete('/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.DELETE_CATEGORY),
    adminActionLogger('DELETE_CATEGORY'),
    deleteCategory
)


export default router;