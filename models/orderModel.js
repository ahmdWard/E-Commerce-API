const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    items:[
        {
            product:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required: true,
                 min: 1,
                 default: 1
            }
        }
    ],
    totalPrice:{
        type:Number,
        default:0
    },
    currency:{
        type:String,
        default:'usd'
    },
    status:{
        type:String,
        enum:['pending', 'proccessing', 'failed', 'shipped', 'delivered', 'cancelled'], default: 'pending' 
    },
    paymentMethod:{
        type: String,
         enum: ['credit_card', 'paypal','stripe', 'COD'],
          required: true 
    },
    address:{
        type:String,
        required:true
    }

},{timestamps:true})


const order = mongoose.model('Order',orderSchema)

module.exports = order