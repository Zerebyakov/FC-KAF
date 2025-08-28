import Addon from "../models/Addon.js";



export const addAddon = async (req,res) => {
    try {
        const {cart_item_id, name, price} = req.body;

        const addon = await Addon.create({
            cart_item_id,
            name,
            price
        })
        res.status(201).json(addon)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}