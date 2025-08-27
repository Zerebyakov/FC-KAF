import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Customer from "./Customer.js";


const {DataTypes} = Sequelize
const Transaction = db.define('Transaction',{
    transaction_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total_amount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    payment_method:{
        type: DataTypes.ENUM([
            'pending',
            'paid',
            'processing',
            'completed',
            'canceled'
        ]),
        defaultValue: 'pending'
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName: 'transactions'
})


Customer.hasMany(Transaction, {foreignKey:'customer_id'})
Transaction.belongsTo(Customer, {foreignKey:'customer_id'})


export default Transaction;

(async () => {
    await db.sync();
})();