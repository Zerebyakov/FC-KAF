import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import SequelizeStore from 'connect-session-sequelize'

import db from './config/Database.js'
import AuthRoute from './routes/AuthRoute.js'
import StaffRoute from './routes/StaffRoute.js'
import CustomerRoute from './routes/CustomerRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import ProductRoute from './routes/ProductRoute.js'



dotenv.config();

const app = express()
const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
    db:db
})


app.use(session({
    secret:process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie:{
        secure: false
    }
}))

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN_APP
}))
app.use(express.json())
app.use(AuthRoute)
app.use(StaffRoute)
app.use(CustomerRoute)
app.use(CategoryRoute)
app.use(ProductRoute)




app.listen(process.env.APP_PORT, ()=>{
    console.log('Server up and running !!')
})