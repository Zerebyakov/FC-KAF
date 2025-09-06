import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import Admin from "./Admin.js";
import Transaction from "./Transaction.js";



const { DataTypes } = Sequelize;
const TransactionHistory = db.define('TransactionHistory', {
    history_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transaction,
            key: 'transaction_id'
        }
    },
    status_from: {
        type: DataTypes.ENUM([
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'on_delivery',
            'delivered',
            'cancelled'
        ]),
        allowNull: true
    },
    status_to: {
        type: DataTypes.ENUM([
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'on_delivery',
            'delivered',
            'cancelled'
        ]),
        allowNull: false
    },
    changed_by:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Admin,
            key: 'admin_id',
        }
    },
    notes:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    timestamp:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'transaction_histories'
})

Transaction.hasMany(TransactionHistory, {foreignKey:'transaction_id'})
TransactionHistory.belongsTo(Transaction, {foreignKey:'transaction_id'})

Admin.hasMany(TransactionHistory,{foreignKey:'changed_by'})
TransactionHistory.belongsTo(Admin, {foreignKey:'changed_by'})


export default TransactionHistory;
