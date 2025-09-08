import Transaction from "../models/Transaction.js";
import TransactionHistory from "../models/TransactionHIstory.js";
import Admin from "../models/Admin.js";
import User from "../models/Users.js";
import db from "../config/Config.js";
import { Op } from "sequelize";






// Customer confirms payment (after making payment)
export const confirmPayment = async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { transaction_id, payment_reference, notes } = req.body;
        const user_id = req.session.userId;

        if (!user_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        if (!transaction_id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Transaction ID is required"
            });
        }

        // Find transaction and verify ownership
        const orderTransaction = await Transaction.findOne({
            where: {
                transaction_id,
                user_id // Ensure customer can only confirm their own payment
            }
        });

        if (!orderTransaction) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Transaction not found or access denied"
            });
        }

        // Check if payment is already paid
        if (orderTransaction.payment_status === 'paid') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Payment already confirmed"
            });
        }

        // Check if transaction is cancelled
        if (orderTransaction.order_status === 'cancelled') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Cannot confirm payment for cancelled order"
            });
        }

        // For cash payment, directly set to paid
        if (orderTransaction.payment_method === 'cash') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Cash payment does not require confirmation"
            });
        }

        // Update payment status to paid (since we don't have waiting_confirmation in existing enum)
        await orderTransaction.update({
            payment_status: 'paid'
        }, { transaction });

        // If order is still pending and payment confirmed, change to confirmed
        if (orderTransaction.order_status === 'pending') {
            await orderTransaction.update({
                order_status: 'confirmed'
            }, { transaction });
        }

        // Create transaction history
        await TransactionHistory.create({
            transaction_id: orderTransaction.transaction_id,
            status_from: orderTransaction.order_status,
            status_to: orderTransaction.order_status === 'pending' ? 'confirmed' : orderTransaction.order_status,
            changed_by: user_id,
            changed_by_type: 'customer',
            notes: `Payment confirmed by customer. Reference: ${payment_reference || 'N/A'}. ${notes || ''}`.trim(),
            timestamp: new Date()
        }, { transaction });

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: "Payment confirmed successfully",
            data: {
                transaction_id: orderTransaction.transaction_id,
                order_number: orderTransaction.order_number,
                payment_status: 'paid',
                order_status: orderTransaction.order_status === 'pending' ? 'confirmed' : orderTransaction.order_status,
                payment_reference: payment_reference,
                confirmed_at: new Date()
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Confirm payment error:', error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Admin manually updates payment status
export const updatePaymentStatus = async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { transaction_id } = req.params;
        const { payment_status, notes } = req.body;
        const admin_id = req.session.adminId;

        if (!admin_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Admin access required"
            });
        }

        // Validate payment status
        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!validPaymentStatuses.includes(payment_status)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Invalid payment status",
                valid_statuses: validPaymentStatuses
            });
        }

        // Find transaction
        const orderTransaction = await Transaction.findByPk(transaction_id);
        if (!orderTransaction) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        const oldPaymentStatus = orderTransaction.payment_status;
        const oldOrderStatus = orderTransaction.order_status;
        let newOrderStatus = oldOrderStatus;

        // Business logic for order status based on payment status
        if (payment_status === 'paid' && oldOrderStatus === 'pending') {
            newOrderStatus = 'confirmed';
        } else if (payment_status === 'failed') {
            newOrderStatus = 'cancelled';
        }

        // Update transaction
        await orderTransaction.update({
            payment_status,
            order_status: newOrderStatus
        }, { transaction });

        // Create transaction history
        await TransactionHistory.create({
            transaction_id: orderTransaction.transaction_id,
            status_from: oldOrderStatus,
            status_to: newOrderStatus,
            changed_by: admin_id,
            changed_by_type: 'admin',
            notes: `Payment status changed from ${oldPaymentStatus} to ${payment_status} by admin. ${notes || ''}`.trim(),
            timestamp: new Date()
        }, { transaction });

        await transaction.commit();

        // Get admin info
        const admin = await Admin.findByPk(admin_id, {
            attributes: ['admin_id', 'name']
        });

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            data: {
                transaction_id: orderTransaction.transaction_id,
                order_number: orderTransaction.order_number,
                previous_payment_status: oldPaymentStatus,
                new_payment_status: payment_status,
                previous_order_status: oldOrderStatus,
                new_order_status: newOrderStatus,
                updated_by: admin ? admin.name : 'Admin',
                updated_at: new Date(),
                admin_notes: notes
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Update payment status error:', error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get transactions by payment status (Admin)
export const getTransactionsByPaymentStatus = async (req, res) => {
    try {
        const admin_id = req.session.adminId;

        if (!admin_id) {
            return res.status(401).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { payment_status = 'pending', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Validate payment status
        const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
        if (!validStatuses.includes(payment_status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status",
                valid_statuses: validStatuses
            });
        }

        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: {
                payment_status,
                payment_method: {
                    [Op.ne]: 'cash' // Exclude cash payments as they don't need confirmation
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name', 'email', 'phone']
                }
            ],
            order: [['createdAt', 'ASC']], // Oldest first for pending payments
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                transactions,
                payment_status,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get transactions by payment status error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get payment details for specific transaction
export const getPaymentDetails = async (req, res) => {
    try {
        const { transaction_id } = req.params;
        const user_id = req.session.userId;
        const admin_id = req.session.adminId;

        if (!user_id && !admin_id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Build where condition
        const whereCondition = { transaction_id };
        if (!admin_id && user_id) {
            whereCondition.user_id = user_id; // Customer can only see their own
        }

        const transaction = await Transaction.findOne({
            where: whereCondition,
            attributes: [
                'transaction_id', 'order_number', 'payment_status',
                'payment_method', 'order_status', 'final_amount',
                'createdAt', 'updatedAt'
            ],
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name', 'email', 'phone']
                },
                {
                    model: TransactionHistory,
                    where: {
                        notes: {
                            [Op.like]: '%payment%'
                        }
                    },
                    required: false,
                    order: [['timestamp', 'DESC']]
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
        console.error('Get payment details error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Mark cash payment as received (for cash on delivery)
export const markCashReceived = async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { transaction_id } = req.params;
        const { notes } = req.body;
        const admin_id = req.session.adminId;

        if (!admin_id) {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: "Admin access required"
            });
        }

        const orderTransaction = await Transaction.findByPk(transaction_id);
        if (!orderTransaction) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (orderTransaction.payment_method !== 'cash') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "This endpoint is only for cash payments"
            });
        }

        if (orderTransaction.order_status !== 'delivered') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Cash can only be marked as received after delivery"
            });
        }

        // Update payment status to paid
        await orderTransaction.update({
            payment_status: 'paid',
            actual_delivery_time: new Date()
        }, { transaction });

        // Create transaction history
        await TransactionHistory.create({
            transaction_id: orderTransaction.transaction_id,
            status_from: 'delivered',
            status_to: 'delivered',
            changed_by: admin_id,
            changed_by_type: 'admin',
            notes: `Cash payment received upon delivery. ${notes || ''}`.trim(),
            timestamp: new Date()
        }, { transaction });

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: "Cash payment marked as received",
            data: {
                transaction_id: orderTransaction.transaction_id,
                order_number: orderTransaction.order_number,
                payment_status: 'paid',
                received_at: new Date()
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Mark cash received error:', error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
