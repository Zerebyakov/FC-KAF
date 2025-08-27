import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Transaction from "./Transaction.js";
import Product from "./Product.js";


const {DataTypes} = Sequelize;
const TransactionDetail = db.define('TransactionDetail',{
    transaction_detail_id:{
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
    timestamps: false,
    tableName:'transaction_details'
})

Transaction.hasMany(TransactionDetail, {foreignKey:'transaction_id'})
TransactionDetail.belongsTo(Transaction, {foreignKey:'transaction_id'})


Product.hasMany(TransactionDetail, {foreignKey:'product_id'})
TransactionDetail.belongsTo(Product, {foreignKey:'product_id'})



export default TransactionDetail;


(async () => {
    await db.sync();
})()