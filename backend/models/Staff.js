import { EmptyResultError, Sequelize } from "sequelize";
import db from "../config/Database.js";


const {DataTypes} = Sequelize;
const Staff = db.define('Staff',{
    staff_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM([
            'admin',
            'staff'
        ])
    }
},{
    freezeTableName: true,
    tableName:"Staff",
    timestamps: true
})

export default Staff;

(async () => {
    await db.sync();
})();