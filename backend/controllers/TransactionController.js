import { Op } from "sequelize";
import Admin from "../models/Admin.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import TransactionHistory from "../models/TransactionHIstory.js";
import TransactionItem from "../models/TransactionItem.js";
import User from "../models/Users.js";
import ProductAddon from "../models/ProductAddon.js";
import db from "../config/Config.js";




export const createTransaction = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const { delivery_address, customer_notes, payment_method } = req.body;
        const user_id = req.session.userId;

        if (!user_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        if (!delivery_address || !payment_method) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Delivery address and payment method are required"
            });
        }

        // Get cart items with products and potential addons
        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    include: [ProductAddon] // Include addons if needed
                }
            ]
        });

        if (cartItems.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate totals properly
        let subtotal = 0;
        const processedItems = [];

        for (const cartItem of cartItems) {
            const basePrice = cartItem.Product.base_price * cartItem.quantity;
            let addonsTotal = 0;

            // Calculate addons total if selected_addons exists
            if (cartItem.selected_addons && Array.isArray(cartItem.selected_addons)) {
                for (const addon of cartItem.selected_addons) {
                    const addonData = await ProductAddon.findByPk(addon.addon_id);
                    if (addonData) {
                        addonsTotal += addonData.addon_price * (addon.quantity || 1);
                    }
                }
            }

            const itemTotal = basePrice + addonsTotal;
            subtotal += itemTotal;

            processedItems.push({
                cart_item: cartItem,
                item_total: itemTotal,
                addons_total: addonsTotal
            });
        }

        // Calculate fees and final amount
        const delivery_fee = parseInt(process.env.DELIVERY_FEE) || 5000;
        const tax_rate = parseFloat(process.env.TAX_RATE) || 0.1;
        const tax_amount = Math.round(subtotal * tax_rate);
        const final_amount = subtotal + delivery_fee + tax_amount;

        // Generate better order number
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const orderCount = await Transaction.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(today.setHours(0, 0, 0, 0))
                }
            }
        });
        const order_number = `FCD${dateStr}${String(orderCount + 1).padStart(3, '0')}`;

        // Create transaction with proper field names
        const newTransaction = await Transaction.create({
            user_id,
            order_number,
            order_status: 'pending', // Use correct field name
            payment_method,
            payment_status: 'pending',
            total_amount: subtotal, // Subtotal before fees
            delivery_fee,
            tax_amount,
            discount_amount: 0,
            final_amount,
            delivery_address,
            customer_notes: customer_notes || null,
            estimated_delivery_time: new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
        }, { transaction });

        // Create transaction items
        for (const { cart_item, item_total } of processedItems) {
            await TransactionItem.create({
                transaction_id: newTransaction.transaction_id,
                product_id: cart_item.product_id,
                quantity: cart_item.quantity,
                unit_price: cart_item.Product.base_price,
                selected_addons: JSON.stringify(cart_item.selected_addons || []),
                subtotal: item_total,
                item_notes: cart_item.notes || null
            }, { transaction });
        }

        // Create transaction history with proper changed_by field
        await TransactionHistory.create({
            transaction_id: newTransaction.transaction_id,
            status_from: null,
            status_to: 'pending',
            changed_by: user_id, // Set the user who created the order
            changed_by_type: 'customer', // Add type if your model has it
            notes: 'Order created by customer',
            timestamp: new Date()
        }, { transaction });

        // Clear cart
        await Cart.destroy({ 
            where: { user_id },
            transaction 
        });

        // Commit transaction
        await transaction.commit();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                transaction_id: newTransaction.transaction_id,
                order_number: newTransaction.order_number,
                status: newTransaction.order_status,
                subtotal: newTransaction.total_amount,
                delivery_fee: newTransaction.delivery_fee,
                tax_amount: newTransaction.tax_amount,
                final_amount: newTransaction.final_amount,
                payment_method: newTransaction.payment_method,
                estimated_delivery_time: newTransaction.estimated_delivery_time,
                createdAt: newTransaction.createdAt
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Create transaction error:', error);
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const {
            status,
            start_date,
            end_date,
            page = 1,
            limit = 10
        } = req.query;

        const whereCondition = {};
        if (status) whereCondition.order_status = status;
        if (start_date && end_date) {
            whereCondition.createdAt = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        const offset = (page - 1) * limit;
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name', 'email', 'phone']
                },
                {
                    model: TransactionItem,
                    include: [
                        {
                            model: Product,
                            attributes: ['product_id', 'name', 'base_price', 'image_url']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                transactions,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all transactions error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.session.userId;
        const admin_id = req.session.adminId;

        // Build where condition - admin can see all, customer only their own
        const whereCondition = { transaction_id: id };
        if (!admin_id && user_id) {
            whereCondition.user_id = user_id;
        } else if (!admin_id && !user_id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const transaction = await Transaction.findOne({
            where: whereCondition,
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name', 'email', 'phone']
                },
                {
                    model: TransactionItem,
                    include: [
                        {
                            model: Product,
                            attributes: ['product_id', 'name', 'base_price', 'image_url']
                        }
                    ]
                },
                {
                    model: TransactionHistory,
                    include: [
                        {
                            model: Admin,
                            attributes: ['admin_id', 'name'],
                            required: false // Left join
                        }
                    ],
                    order: [['timestamp', 'ASC']]
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found or access denied"
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });

    } catch (error) {
        console.error('Get transaction by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getUserTransactions = async (req, res) => {
    try {
        const user_id = req.session.userId;
        const { status, page = 1, limit = 10 } = req.query;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const whereCondition = { user_id };
        if (status) whereCondition.order_status = status;

        const offset = (page - 1) * limit;

        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: TransactionItem,
                    include: [
                        {
                            model: Product,
                            attributes: ['product_id', 'name', 'image_url', 'base_price']
                        }
                    ]
                },
                {
                    model: TransactionHistory,
                    order: [['timestamp', 'DESC']],
                    limit: 1 // Only get latest status
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                orders: transactions, // Use 'orders' for consistency with API docs
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get user transactions error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateTransactionStatus = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const admin_id = req.session.adminId;

        if (!admin_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Admin access required"
            });
        }

        // Validate status
        const validStatuses = [
            'pending', 'confirmed', 'preparing', 
            'ready_for_delivery', 'on_delivery', 
            'completed', 'cancelled', 'delivered' // Added delivered for backward compatibility
        ];

        if (!validStatuses.includes(status)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Invalid status",
                valid_statuses: validStatuses
            });
        }

        // Find transaction
        const currentTransaction = await Transaction.findByPk(id);
        if (!currentTransaction) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // Validate status transition (optional - add business rules)
        const validTransitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['preparing', 'cancelled'],
            'preparing': ['ready_for_delivery', 'cancelled'],
            'ready_for_delivery': ['on_delivery', 'cancelled'],
            'on_delivery': ['completed', 'delivered', 'cancelled'],
            'completed': [], // Final status
            'delivered': [], // Final status (backward compatibility)
            'cancelled': [] // Final status
        };

        const currentStatus = currentTransaction.order_status;
        const allowedNextStatuses = validTransitions[currentStatus] || [];
        
        if (allowedNextStatuses.length > 0 && !allowedNextStatuses.includes(status)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Invalid status transition",
                current_status: currentStatus,
                allowed_next_statuses: allowedNextStatuses
            });
        }

        // Update transaction
        const updatedFields = {
            order_status: status
        };

        // Set delivery time if completed or delivered
        if (status === 'completed' || status === 'delivered') {
            updatedFields.actual_delivery_time = new Date();
        }

        await currentTransaction.update(updatedFields, { transaction });

        // Create history record with proper changed_by
        await TransactionHistory.create({
            transaction_id: parseInt(id),
            status_from: currentStatus,
            status_to: status,
            changed_by: admin_id,
            changed_by_type: 'admin', // Add type if your model supports it
            notes: notes || `Status changed from ${currentStatus} to ${status}`,
            timestamp: new Date()
        }, { transaction });

        await transaction.commit();

        // Get admin info for response
        const admin = await Admin.findByPk(admin_id, {
            attributes: ['admin_id', 'name']
        });

        res.status(200).json({
            success: true,
            message: "Transaction status updated successfully",
            data: {
                transaction_id: parseInt(id),
                order_number: currentTransaction.order_number,
                previous_status: currentStatus,
                new_status: status,
                updated_by: admin ? admin.name : 'Admin',
                admin_notes: notes || null,
                updated_at: new Date()
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Update transaction status error:', error);
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};