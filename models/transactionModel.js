const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
    },
    order:{
        type:mongoose.Schema.ObjectId,
        ref:'order',
        required:true
    },
    payment:{
        type:mongoose.Schema.ObjectId,
        ref:'payment',
        required:true
    },
    status: {
        type: String,
        enum: ["Success", "Failed","Pending"],
        default: "Pending" 
    },
    gateWayResponse:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
},{timestamps:true})

const transaction = mongoose.model('Transaction',transactionSchema)

module.exports = transaction 