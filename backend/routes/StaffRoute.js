import express from 'express'
import { createStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from '../controllers/StaffController.js';

const router = express.Router();


router.get('/staff', getAllStaff)
router.post('/staff', createStaff)
router.get('/staff/:staff_id', getStaffById)
router.patch('/staff/:staff_id', updateStaff)
router.delete('/staff/:staff_id', deleteStaff)


export default router;