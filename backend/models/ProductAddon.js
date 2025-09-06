import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import Product from "./Product.js";



const {DataTypes} = Sequelize;

const ProductAddon = db.define('ProductAddon',{
    addon_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Product,
            key:'product_id'
        }
    },
    addon_name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    addon_price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    addon_category:{
        type: DataTypes.ENUM([
            'topping',
            'drink',
            'sauce',
            'size',
            'side_dish'
        ]),
        allowNull: false
    },
    is_available:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName: 'product_addons'
})

Product.hasMany(ProductAddon, {foreignKey:'product_id'})
ProductAddon.belongsTo(Product, {foreignKey:'product_id'})


export default ProductAddon;

