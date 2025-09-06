import { Sequelize } from "sequelize";
import db from "../config/Config.js";



const {DataTypes} = Sequelize;

const Admin = db.define('Admin',{
    admin_id:{
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
    password:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM([
            'admin',
            'staff'
        ]),
        allowNull: false
    },
    permissions:{
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON object storing specific permissions'
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    freezeTableName:true,
    timestamps: true,
    tableName:'admins'
})


export default Admin;

