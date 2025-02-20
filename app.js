const express =require ('express')
const dotenv =require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
dotenv.config()

const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const categoryRoute = require('./routes/categoryRoutes')
const brandRoute = require('./routes/brandRoutes')
const subCategoryRoute = require('./routes/subCategoryRoutes')
const wishListRoute = require('./routes/wishListRoute')
const reviewRoutes = require('./routes/reviewRoute')
const inventoryRoutes = require('./routes/inventoryRoutes')
const cartRoutes = require('./routes/cartRoutes')
const globalErrors = require('./middleware/errorController')


const app = express()

app.use(express.json())
app.use(cookieParser())

const NODE_ENV = process.env.NODE_ENV
if (NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode ${NODE_ENV}`);
}


app.use('/api/v1/user',userRoute)
app.use('/api/v1/product',productRoute)
app.use('/api/v1/category',categoryRoute)
app.use('/api/v1/brand',brandRoute)
app.use('/api/v1/subcategory',subCategoryRoute)
app.use('/api/v1/wishList',wishListRoute)
app.use('/api/v1/review',reviewRoutes)
app.use('/api/v1/inventory',inventoryRoutes)
app.use('/api/v1/cart',cartRoutes)

app.use(globalErrors);


module.exports= app