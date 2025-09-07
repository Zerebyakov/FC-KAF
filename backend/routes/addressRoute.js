import express from 'express';
import { createAddress, deleteAddress, getUserAddresses, updateAddress } from '../controllers/AddressController.js';

const router = express.Router();

router.get('/',
    getUserAddresses
)
router.post('/',
    createAddress
)
router.put('/:id',
    updateAddress
)
router.delete('/:id',
    deleteAddress
)


export default router;