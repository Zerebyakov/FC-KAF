import Cart from "../models/Cart.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ProductAddon from "../models/ProductAddon.js";





export const addToCart = async (req, res) => {
    try {
        const {
            product_id, quantity,
            selected_addons, notes
        } = req.body;
        const user_id = req.session.userId;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            })
        }
        if (!product_id || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            });
        }

        const product = await Product.findByPk(product_id);
        if (!product || !product.is_available) {
            return res.status(404).json({
                success: false,
                message: "Product not available"
            });
        }
        //total harga
        let subtotal = product.base_price * quantity;
        if (selected_addons && selected_addons.length > 0) {
            const addons = await ProductAddon.findAll({
                where: {
                    addon_id: selected_addons.map(addon => addon.addon_id),
                    is_available: true
                }
            });
            for (const selectedAddon of selected_addons) {
                const addon = addons.find(a => a.addon_id === selectedAddon.addon_id);
                if (addon) {
                    subtotal += addon.addon_price * (selectedAddon.quantity || 1) * quantity;
                }
            }
        }

        // cek item
        const existingCartItem = await Cart.findOne({
            where: {
                user_id,
                product_id
            }
        })
        if (existingCartItem) {
            // Update existing cart item
            await existingCartItem.update({
                quantity: existingCartItem.quantity + quantity,
                selected_addons,
                subtotal: existingCartItem.subtotal + subtotal,
                notes
            });

            res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                data: existingCartItem
            });
        } else {
            // Create new cart item
            const cartItem = await Cart.create({
                user_id,
                product_id,
                quantity,
                selected_addons,
                subtotal,
                notes
            });

            res.status(201).json({
                success: true,
                message: "Added to cart successfully",
                data: cartItem
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getCart = async (req, res) => {
    try {
        const user_id = req.session.userId

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const cartItems = await Cart.findAll({
            where: {
                user_id
            },
            include: [
                {
                    model: Product,
                    include: [
                        {
                            model: Category
                        }
                    ]
                }
            ]
        })

        const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        res.status(200).json({
            success: true,
            data: {
                items: cartItems,
                total_amount: totalAmount,
                total_items: cartItems.length
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


export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, selected_addons, notes } = req.body;
        const user_id = req.session.userId;

        const cartItem = await Cart.findOne({
            where: { cart_id: id, user_id },
            include: [{ model: Product }]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        // Recalculate subtotal
        let subtotal = cartItem.Product.base_price * (quantity || cartItem.quantity);

        if (selected_addons && selected_addons.length > 0) {
            const addons = await ProductAddon.findAll({
                where: {
                    addon_id: selected_addons.map(addon => addon.addon_id),
                    is_available: true
                }
            });

            for (const selectedAddon of selected_addons) {
                const addon = addons.find(a => a.addon_id === selectedAddon.addon_id);
                if (addon) {
                    subtotal += addon.addon_price * (selectedAddon.quantity || 1) * (quantity || cartItem.quantity);
                }
            }
        }

        await cartItem.update({
            quantity: quantity || cartItem.quantity,
            selected_addons: selected_addons || cartItem.selected_addons,
            subtotal,
            notes: notes || cartItem.notes
        });

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: cartItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.session.userId;

        const cartItem = await Cart.findOne({
            where: { cart_id: id, user_id }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        await cartItem.destroy();

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user_id = req.session.userId;

        await Cart.destroy({
            where: { user_id }
        });

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
