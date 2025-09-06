import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import Transaction from "./Transaction.js";
import Product from "./Product.js";



const {DataTypes} = Sequelize;
const TransactionItem = db.define('TransactionItem',{
    item_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transaction_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Transaction,
            key:'transaction_id'
        }
    },
    product_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Product,
            key: 'product_id'
        }
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            min:1
        }
    },
    unit_price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    selected_addons:{
        type: DataTypes.JSON,
        allowNull: true,
        comment:'Array of selected addons with prices'
    },
    subtotal:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    item_notes:{
        type: DataTypes.TEXT,
        allowNull: true
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName:'transaction_items'
})

Transaction.hasMany(TransactionItem, {foreignKey:'transaction_id'})
TransactionItem.belongsTo(Transaction, {foreignKey:'transaction_id'})

Product.hasMany(TransactionItem, {foreignKey:'product_id'})
TransactionItem.belongsTo(Product, {foreignKey:'product_id'})

export default TransactionItem;

