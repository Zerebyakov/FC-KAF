import Transaction from "../models/Transaction.js";
import TransactionItem from "../models/TransactionItem.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { col, fn, literal, Op } from "sequelize";




export const getDailySalesReport = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();

        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const dailySales = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                payment_status: 'paid'
            },
            attributes: [
                [fn('COUNT', col('transaction_id')), 'total_orders'],
                [fn('SUM', col('final_amount')), 'total_revenue'],
                [fn('AVG', col('final_amount')), 'average_order_value']
            ]
        });

        const topProducts = await TransactionItem.findAll({
            include: [
                {
                    model: Transaction,
                    where: {
                        createdAt: {
                            [Op.between]: [startOfDay, endOfDay]
                        },
                        payment_status: 'paid'
                    },
                    attributes: []
                },
                {
                    model: Product,
                    attributes: ['product_id', 'name']
                }
            ],
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'total_sold'],
                [fn('SUM', col('subtotal')), 'total_revenue']
            ],
            group: ['product_id', 'Product.product_id', 'Product.name'],
            order: [[fn('SUM', col('quantity')), 'DESC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            data: {
                date: targetDate.toISOString().split('T')[0],
                summary: dailySales[0],
                top_products: topProducts
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getMonthlySalesReport = async (req, res) => {
    try {
        const { year, month } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();

        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        const monthlySales = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
                payment_status: 'paid'
            },
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('COUNT', col('transaction_id')), 'total_orders'],
                [fn('SUM', col('final_amount')), 'total_revenue']
            ],
            group: [fn('DATE', col('createdAt'))],
            order: [[fn('DATE', col('createdAt')), 'ASC']]
        });

        const categoryReport = await TransactionItem.findAll({
            include: [
                {
                    model: Transaction,
                    where: {
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth]
                        },
                        payment_status: 'paid'
                    },
                    attributes: []
                },
                {
                    model: Product,
                    include: [{
                        model: Category,
                        attributes: ['category_id', 'name']
                    }],
                    attributes: []
                }
            ],
            attributes: [
                [col('Product.Category.category_id'), 'category_id'],
                [col('Product.Category.name'), 'category_name'],
                [fn('SUM', col('quantity')), 'total_sold'],
                [fn('SUM', col('subtotal')), 'total_revenue']
            ],
            group: ['Product.Category.category_id', 'Product.Category.name'],
            order: [[fn('SUM', col('subtotal')), 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                period: `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`,
                daily_sales: monthlySales,
                category_performance: categoryReport
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getInventoryReport = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                attributes: ['category_id', 'name']
            }],
            order: [['stock_quantity', 'ASC']]
        });

        const lowStockProducts = products.filter(product => product.stock_quantity <= 10);
        const outOfStockProducts = products.filter(product => product.stock_quantity === 0);

        res.status(200).json({
            success: true,
            data: {
                all_products: products,
                low_stock_alert: lowStockProducts,
                out_of_stock: outOfStockProducts,
                total_products: products.length
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
