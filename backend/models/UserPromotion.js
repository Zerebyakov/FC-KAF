import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import User from "./Users.js";
import Promotion from "./Promotion.js";



const {DataTypes} = Sequelize;
const UserPromotion = db.define('UserPromotion', {
    user_promotion_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: User,
            key: 'user_id'
        }
    },
    promotion_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Promotion,
            key: 'promotion_id'
        }
    },
    used_count:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    last_used:{
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName: 'user_promotions'
})

User.belongsToMany(Promotion, {
    through:UserPromotion,
    foreignKey:'user_id',
    otherKey:'promotion_id'
})

Promotion.belongsToMany(User, {
    through:UserPromotion,
    foreignKey:'promotion_id',
    otherKey:'user_id'
})




export default UserPromotion;

