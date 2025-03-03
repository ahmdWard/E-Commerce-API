const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    order:{
        type:mongoose.Schema.ObjectId,
        ref:'Order',
        required:true,
    },
    currency:{
        type:String,
        default:'usd'
    },
    paymentMethod:{
        type:String,
        enum:['COD','credit_card','stripe','paypal'],
        required:true
    },
    status:{
        type:String,
        enum:['completed','pending','failed'],
        default:'pending',
        required:true
    },
    transactionId:{
        type:String,
        unique:true
    }
},{timestamps:true})

const payment = mongoose.model('Payment',paymentSchema)
module.exports = payment