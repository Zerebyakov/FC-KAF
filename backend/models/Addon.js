import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import CartItem from "./CartItem.js";


const {DataTypes} = Sequelize
const Addon = db.define('Addon',{
    addon_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: false,
    tableName:'addons'
})


CartItem.hasMany(Addon, {foreignKey:'cart_item_id'})
Addon.belongsTo(CartItem, {foreignKey:'cart_item_id'})


export default Addon;

(async () => {
    await db.sync();
})()