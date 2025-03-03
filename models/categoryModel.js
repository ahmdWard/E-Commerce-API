const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'category name is required'],
        unique:true,
        trim:true,
        minLength:[2,"category name must be more than 2 characters"],
        maxLength:[50,"category name must me less than 50 characters"]
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},
{ timestamps: true }
);

const category = mongoose.model("Category",categorySchema)

module.exports = category

