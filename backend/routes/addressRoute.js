import express from 'express';
import { createAddress, deleteAddress, getUserAddresses, updateAddress } from '../controllers/AddressController.js';

const router = express.Router();

router.get('/addresses',
    getUserAddresses
)
router.post('/addresses',
    createAddress
)
router.put('/addresses/:id',
    updateAddress
)
router.delete('/addresses/:id',
    deleteAddress
)


export default router;