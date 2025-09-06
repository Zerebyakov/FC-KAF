import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import User from "./Users.js";



const {DataTypes} = Sequelize;
const Transaction = db.define('Transaction',{
    transaction_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: User,
            key: 'user_id'
        }
    },
    order_number:{
        type:DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    total_amount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    delivery_fee:{
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    },
    tax_amount:{
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    },
    discount_amount:{
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    },
    final_amount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    payment_method:{
        type: DataTypes.ENUM([
            'cash',
            'transfer',
            'e_wallet',
            'qris'
        ]),
        allowNull: false
    },
    payment_status:{
        type: DataTypes.ENUM([
            'pending',
            'paid',
            'failed',
            'refunded'
        ]),
        defaultValue: 'pending'
    },
    order_status:{
        type: DataTypes.ENUM([
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'on_delivery',
            'delivered',
            'cancelled'
        ]),
        defaultValue: 'pending'
    },
    delivery_address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    customer_notes:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    estimated_delivery_time:{
        type: DataTypes.DATE,
        allowNull: true
    },
    actual_delivery_time:{
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName:'transactions'
})

User.hasMany(Transaction, {foreignKey:'user_id'})
Transaction.belongsTo(User, {foreignKey:'user_id'})




export default Transaction;

