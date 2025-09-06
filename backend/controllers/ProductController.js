import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductAddon from "../models/ProductAddon.js";



export const createProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            base_price,
            image_url,
            stock_quantity,
            preparation_time
        } = req.body;

        if (!category_id || !name || !base_price || !preparation_time) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: category_id, name, base_price, preparation_time'
            })
        }


        const product = await Product.create({
            category_id,
            name,
            description,
            base_price,
            image_url,
            stock_quantity: stock_quantity || 0,
            preparation_time
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const {
            category_id
        } = req.query;

        const whereCondition = {
            is_available: true
        }
        if (category_id) {
            whereCondition.category_id = category_id
        }

        const products = await Product.findAll({
            where: whereCondition,
            include: [
                {
                    model: Category,
                    attributes: [
                        'category_id',
                        'name'
                    ]
                },
                {
                    model: ProductAddon,
                    where: {
                        is_available: true
                    },
                    required: false
                }

            ]
        });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: [
                        'category_id',
                        'name'
                    ]
                },
                {
                    model: ProductAddon,
                    where: {
                        is_available: true
                    },
                    required: false
                }
            ]
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            category_id,
            name,
            description,
            base_price,
            image_url,
            stock_quantity,
            is_available,
            preparation_time
        } = req.body;


        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        await product.update({
            category_id: category_id || product.category_id,
            name: name || product.name,
            description: description || product.description,
            base_price: base_price || product.base_price,
            image_url: image_url || product.image_url,
            stock_quantity: stock_quantity !== undefined ? stock_quantity : product.stock_quantity,
            is_available: is_available !== undefined ? is_available : product.is_available,
            preparation_time: preparation_time || product.preparation_time
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock_quantity } = req.body;

        if (stock_quantity === undefined) {
            return req.status(400).json({
                success: false,
                message: "Stock quantity is required"
            })
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.update({
            stock_quantity
        });

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: {
                product_id: product.product_id,
                name: product.name,
                stock_quantity: product.stock_quantity
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}