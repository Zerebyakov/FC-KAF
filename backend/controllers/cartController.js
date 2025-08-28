import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem";
import Product from "../models/Product.js";
import Addon from "../models/Addon.js";



export const createCart = async (req, res) => {
    try {
        const {
            customer_id
        } = req.body;

        let cart = await Cart.findOne({
            where: {
                customer_id, 
                status: 'pending'
            }
        });

        if(!cart) {
            cart = await Cart.create({
                customer_id,
                status:'pending'
            });
        }
        res.status(201).json(cart)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
};


export const addToCart = async (req,res) => {
    try {
        const {
            cart_id,
            product_id,
            quantity
        } = req.body;

        const product = await Product.findByPk(product_id);
        if(!product) {
            return res.status(404).json({msg:"Product not found"})
        }

        const cartItem = await CartItem.create({
            cart_id,
            product_id,
            quantity,
            price: product.price
        })

        res.status(201).json(cartItem)
    } catch (error) {
        console.log(error.message)
    }

}


export const getCart = async (req,res) => {
    try {
        const {
            cart_id
        } = req.params;

        const cart = await Cart.findByPk(cart_id, {
            include: [
                {
                    model: CartItem,
                    include:[
                        Product,
                        Addon
                    ]
                }
            ]
        });

        if(!cart) {
            return res.status(404).json({msg:'Cart not found'})
        }
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}