import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'




dotenv.config();

const app = express()



app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN_APP
}))
app.use(express.json())
app.listen(process.env.APP_PORT, ()=>{
    console.log('Server up and running !!')
})