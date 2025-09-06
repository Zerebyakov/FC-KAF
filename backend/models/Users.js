import { Sequelize } from "sequelize";
import db from "../config/Config.js";

const {DataTypes} = Sequelize;

const User = db.define('User',{
    user_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    phone:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    address:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    freezeTableName: true,
    timestamps:true,
    tableName: 'users'
})

export default User;