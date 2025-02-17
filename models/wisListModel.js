const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({

    product: [
        {
            type:mongoose.Schema.ObjectId,
            ref:'Product'
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    
},{timestamps:true})


wishListSchema.pre(/^find/,function(next){

    this.populate({path:"product"})

    next()
})

const wishList= mongoose.model('WishList',wishListSchema)

module.exports = wishList