import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import User from "./Users.js";


const { DataTypes } = Sequelize;
const Address = db.define('Address', {
    address_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:User,
            key: 'user_id'
        }
    },
    label:{
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'e.g., "Home", "Office", "Other"'
    },
    recipient_name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    full_address:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    city:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    postal_code:{
        type: DataTypes.STRING(10),
        allowNull: true
    },
    latitude:{
        type: DataTypes.DECIMAL(10,8),
        allowNull: true
    },
    longitude:{
        type: DataTypes.DECIMAL(11,8),
        allowNull: true
    },
    is_default:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    tableName: 'addresses'
})


User.hasMany(Address, {foreignKey:'user_id'})
Address.belongsTo(User, {foreignKey:'user_id'})

export default Address;

