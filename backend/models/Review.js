import { Sequelize } from "sequelize";
import db from "../config/Config.js";
import User from "./Users.js";
import Transaction from "./Transaction.js";




const {DataTypes} = Sequelize;
const Review =  db.define('Review',{
    review_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    transaction_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Transaction,
            key: 'transaction_id'
        }
    },
    rating:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            min:1,
            max:5
        }
    },
    comment:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    food_rating:{
        type: DataTypes.INTEGER,
        allowNull: true,
        validate:{
            min:1,
            max:5
        }
    },
    service_rating:{
        type: DataTypes.INTEGER,
        allowNull: true,
        validate:{
            min:1,
            max: 5
        }
    },
    delivery_rating:{
        type:DataTypes.INTEGER,
        allowNull: true,
        validate:{
            min:1,
            max:5
        }
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName:'reviews'
})


User.hasMany(Review, {foreignKey:'user_id'})
Review.belongsTo(User, {foreignKey:'user_id'})

Transaction.hasMany(Review, {foreignKey:'transaction_id'})
Review.belongsTo(Transaction, {foreignKey:'transaction_id'})

export default Review;

