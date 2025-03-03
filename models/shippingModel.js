const mongoose = require('mongoose')

const shippingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    order:{
        type:mongoose.Schema.ObjectId,
        ref:'Order',
        required:true
    },
    status:{
        type:String,
        enum:['pending' ,'out of delivery' ,'delivered']
    },
    address:{
            country:{
                type:String,
                required:true
            },
            state:{
                type:String,
                required:true
            },
            street:{
                type:String,
                required:true
            },
            building:{
                type:Number,
                required:true
            },
            flatNumber:{
                type:Number,
                required:true
            }
        }
    
},{timestamps:true})


const shipping = mongoose.model('Shipping',shippingSchema)
module.exports = shipping