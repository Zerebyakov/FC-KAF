import { Sequelize } from "sequelize";
import db from "../config/Config.js";



const { DataTypes } = Sequelize;
const Promotion = db.define('Promotion', {
    promotion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.ENUM([
            'percentage',
            'fixed_amount'
        ]),
        allowNull: false
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    minimun_order: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    maximum_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Total usage limit for this promo'
    },
    usage_per_user: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Usage limit per user'
    },
    start_date:{
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date:{
        type: DataTypes.DATE,
        allowNull: false
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    freezeTableName: true,
    timestamps: true,
    tableName: 'promotions'
})



export default Promotion;

