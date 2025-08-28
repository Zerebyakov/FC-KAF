import Addon from "../models/Addon";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js"
import TransactionDetail from "../models/TransactionDetail.js";





export const createTransaction = async (req, res) => {
    const t = await Transaction.sequelize.transaction();
    try {
        const {
            cart_id,
            payment_method
        } = req.body;
        const cart = await Cart.findByPk(cart_id, {
            include: [
                {
                    model: CartItem,
                    include: [
                        Product,
                        Addon
                    ]
                }
            ]
        })

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' })
        }
        if (cart.status === 'paid') {
            return res.status(400).json({ msg: "Cart already paid" })
        }

        let total = 0;
        for (const item of cart.CartItems) {
            let itemTotal = item.price * item.quantity;
            for (const addon of item.Addons) {
                itemTotal += addon.price
            }
            t
            total += itemTotal;
        }
        const transaction = await Transaction.create({
            cart_id,
            total,
            payment_method,
            status: 'paid'
        }, {
            transaction: t
        })

        for (const item of cart.CartItems) {
            await TransitionEvent.create({
                transaction_id: transaction.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }, {
                transaction: t
            });

            const product = await Product.findByPk(item.product_id);
            await product.update({
                stock: product.stock - item.quantity
            }, {
                transaction: t
            })

            await cart.update({
                status: 'paid'
            }, {
                transaction: t
            })

            await t.commit();
            res.status(201).json({ msg: "Transaction successful", transaction });

        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({ msg: error.message });
    }
}

export const getTransactionByCustomer = async (req, res) => {
    try {
        const {
            customer_id
        } = req.params;

        const transaction = await Transaction.findAll({
            include: [TransactionDetail],
            where: {
                customer_id
            }
        })

        res.status(200).json(transaction)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}