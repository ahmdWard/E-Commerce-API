const express =require ('express')
const dotenv =require('dotenv')
const morgan = require('morgan')

dotenv.config()

const app = express()
app.use(express.json())

const NODE_ENV = process.env.NODE_ENV
if (NODE_ENV === 'development') {
    app.use(morgan('dev'))
    console.log(`mode ${NODE_ENV}`);
}



module.exports= app