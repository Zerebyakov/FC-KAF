import { Sequelize } from "sequelize";
import db from "../config/Config.js";


const Category = db.define('Category',{
    category_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url:{
        type: DataTypes.STRING(255),
        allowNull: true
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    sort_order:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName: 'categories'
})

export default Category;
