const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({

    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required:true,
    },
    stock:{
        type:Number,
        require:true,
        min:0
    },
    reservedStock:{
        type:Number,
        default:0,
        min:0
    },
    sold:{
        type:Number,
        default:0,
        min:0
    },
    restocks:[
        {
            quantity:Number,
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    lastUpdated:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})


const inventory = mongoose.model('Inventory',inventorySchema)

module.exports = inventory