import { col, fn } from "sequelize";
import Review from "../models/Review.js";
import Transaction from "../models/Transaction.js";
import User from "../models/Users.js";



export const createReview = async (req, res) => {
    try {
        const { transaction_id, rating, comment, food_rating, service_rating, delivery_rating } = req.body;
        const user_id = req.session.userId;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        if (!transaction_id || !rating) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID and rating are required"
            });
        }

        // Check if transaction belongs to user and is completed
        const transaction = await Transaction.findOne({
            where: { 
                transaction_id, 
                user_id,
                order_status: 'delivered'
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found or not yet delivered"
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            where: { transaction_id, user_id }
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "Review already exists for this transaction"
            });
        }

        const review = await Review.create({
            user_id,
            transaction_id,
            rating,
            comment,
            food_rating,
            service_rating,
            delivery_rating
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: reviews } = await Review.findAndCountAll({
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name']
                },
                {
                    model: Transaction,
                    attributes: ['transaction_id', 'order_number', 'createdAt']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
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


export const getAverageRating = async (req, res) => {
    try {
        const averageRatings = await Review.findAll({
            attributes: [
                [fn('AVG', col('rating')), 'overall_rating'],
                [fn('AVG', col('food_rating')), 'food_rating'],
                [fn('AVG', col('service_rating')), 'service_rating'],
                [fn('AVG', col('delivery_rating')), 'delivery_rating'],
                [fn('COUNT', col('review_id')), 'total_reviews']
            ]
        });

        res.status(200).json({
            success: true,
            data: averageRatings[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};