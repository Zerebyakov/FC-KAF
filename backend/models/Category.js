import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;
const Category = db.define('Category',{
    category_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    }
},{
    freezeTableName: true,
    tableName:'categories',
    timestamps: false
})

export default Category;

(async () => {
    await db.sync();
})()