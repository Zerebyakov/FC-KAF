import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Cart from "./Cart.js";
import Product from "./Product.js";

const {DataTypes} = Sequelize;
const CartItem = db.define('CartItem',{
    cart_item_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: true
})

Cart.hasMany(CartItem, {foreignKey:'cart_id'})
CartItem.belongsTo(Cart, {foreignKey:'cart_id'})

Product.hasMany(CartItem, {foreignKey:'product_id'})
CartItem.belongsTo(Product, {foreignKey:'product_id'})

export default CartItem;


(async () => {
    await db.sync();
})()