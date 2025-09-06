import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import Category from "./Category.js";



const {DataTypes} = Sequelize;

const Product = db.define('Product',{
    product_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Category,
            key: 'category_id'
        }
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    base_price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    image_url:{
        type: DataTypes.STRING(255),
        allowNull: true
    },
    stock_quantity:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_available:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    preparation_time:{
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Preparation time in minutes'
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName: 'products'
})

Category.hasMany(Product, {foreignKey:'category_id'});
Product.belongsTo(Category, {foreignKey:'category_id'});


export default Product;