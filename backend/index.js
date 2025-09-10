import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import SequelizeStore from 'connect-session-sequelize'
import { requestLogger } from './middleware/LoggerMiddleware.js'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import db from './config/Config.js'

import apiRoutes from './routes/allRoutes.js'

dotenv.config();

const app = express();
app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running !!')
})


app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: [process.env.PORT_APP, "'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

app.use(compression())
app.use(cors({
    credentials: true,
    origin: process.env.APP_ORIGIN
}))



// app.use(requestLogger)
app.use(express.json())



app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    },
    name: 'sessionId'
}))

app.use(morgan())

const testDatebaseConnection = async () => {
    try {
        await db.authenticate();
        console.log('Database connection established succesfully')

        await db.sync({ force: false })
        console.log('Database synchronized succesfully')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
testDatebaseConnection();
app.use('/uploads', (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
}, express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/v1', apiRoutes);


// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "🍗 Fried Chicken Delivery API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/v1/auth",
            users: "/api/v1/users",
            admin: "/api/v1/admin",
            categories: "/api/v1/categories",
            products: "/api/v1/products",
            cart: "/api/v1/cart",
            transactions: "/api/v1/transactions",
            addons: "/api/v1/addons",
            addresses: "/api/v1/addresses",
            reports: "/api/v1/reports",
            reviews: "/api/v1/reviews"
        },
        documentation: "https://documenter.getpostman.com/your-collection"
    });
});