import express from 'express'
import { deleteUser, getAllUsers, getUserById, registerUser, updateUser } from '../controllers/UserController.js';
import { requireAdminAuth, requireAuth, requireOwnership } from '../middleware/AuthMiddleware.js';
import { checkPermission, PERMISSIONS } from '../middleware/PermissionMiddleware.js';



const router = express.Router();

router.post('/users/register', registerUser )

// customer rutE
router.get('/users/profile/:id', requireAuth, requireOwnership, getUserById);
router.put('/users/profile/:id', requireAuth, requireOwnership, updateUser)

// admin rute
router.get('/users', 
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_USERS),
    getAllUsers
)
router.get('/users/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.VIEW_USERS),
    getUserById
)
router.put('/users/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.EDIT_USERS),
    updateUser
)
router.delete('/users/:id',
    requireAdminAuth,
    checkPermission(PERMISSIONS.DELETE_USERS),
    deleteUser
)

export default router;
