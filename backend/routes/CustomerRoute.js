import express from 'express'
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from '../controllers/CustomerController.js';
import { isAdmin, isAunthenticated } from '../middleware/Auth.js';


const router = express.Router();

router.get('/customer',isAunthenticated,isAdmin,getCustomers)
router.post('/customer',isAunthenticated,isAdmin, createCustomer)
router.patch('/customer/:customer_id',isAunthenticated,isAdmin, updateCustomer)
router.delete('/customer/:customer_id',isAunthenticated,isAdmin, deleteCustomer)
router.get('/customer/:customer_id',isAunthenticated,isAdmin, getCustomerById)

export default router;
