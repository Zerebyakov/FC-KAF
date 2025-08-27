import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Category from "./Category.js";

const {DataTypes} = Sequelize;
const Product = db.define('Product',{
    product_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT
    },
    price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    stock:{
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    image_url:{
        type: DataTypes.STRING(255)
    }
},{
    freezeTableName:true,
    timestamps: true,
    tableName:'products',
})

Category.hasMany(Product, {foreignKey:'category_id'})
Product.belongsTo(Category, {foreignKey:'category_id'})


export default Product;

(async () => {
    await db.sync()
})()