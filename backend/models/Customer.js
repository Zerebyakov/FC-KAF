import { Sequelize } from "sequelize";
import db from "../config/Database.js";


const {DataTypes} =Sequelize; 
const Customer = db.define('Customer',{
    customer_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING(20),
    },
    address:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName: true,
    tableName: 'customers',
    timestamps: true
})


export default Customer;


(async () => {
    await db.sync();
})()