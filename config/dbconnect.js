const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const url = process.env.DATABASE_URL.replace('<db_password>',process.env.DATABASE_PASSWORD)

const dbConnection =()=>{
    mongoose.
        connect(url)
            .then((conn)=>{
                console.log(`DB connection established successfully ${conn.connection.host}`)
            })
}

module.exports = dbConnection