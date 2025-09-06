import ProductAddon from "../models/ProductAddon.js";
import Product from "../models/Product.js";




export const createAddon = async (req, res) => {
    try {
        const { product_id, addon_name, addon_price, addon_category } = req.body;

        if (!product_id || !addon_name || !addon_price || !addon_category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const addon = await ProductAddon.create({
            product_id,
            addon_name,
            addon_price,
            addon_category
        });

        res.status(201).json({
            success: true,
            message: "Addon created successfully",
            data: addon
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getAddonsByProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        const addons = await ProductAddon.findAll({
            where: { product_id, is_available: true },
            order: [['addon_category', 'ASC'], ['addon_name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: addons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateAddon = async (req, res) => {
    try {
        const { id } = req.params;
        const { addon_name, addon_price, addon_category, is_available } = req.body;

        const addon = await ProductAddon.findByPk(id);
        if (!addon) {
            return res.status(404).json({
                success: false,
                message: "Addon not found"
            });
        }

        await addon.update({
            addon_name: addon_name || addon.addon_name,
            addon_price: addon_price || addon.addon_price,
            addon_category: addon_category || addon.addon_category,
            is_available: is_available !== undefined ? is_available : addon.is_available
        });

        res.status(200).json({
            success: true,
            message: "Addon updated successfully",
            data: addon
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteAddon = async (req, res) => {
    try {
        const { id } = req.params;

        const addon = await ProductAddon.findByPk(id);
        if (!addon) {
            return res.status(404).json({
                success: false,
                message: "Addon not found"
            });
        }

        await addon.update({ is_available: false });

        res.status(200).json({
            success: true,
            message: "Addon deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

