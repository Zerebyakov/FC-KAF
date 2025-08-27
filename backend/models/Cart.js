import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Customer from "./Customer.js";


const {DataTypes} = Sequelize;
const Cart = db.define('Cart',{
    cart_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
},{
    freezeTableName: true,
    timestamps: true
})

Customer.hasMany(Cart, {foreignKey:'customer_id'})
Cart.belongsTo(Customer, {foreignKey:'customer_id'})


export default Cart;

(async()=>{
    await db.sync();
})()