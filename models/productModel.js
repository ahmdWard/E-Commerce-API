const mongoose = require('mongoose')

const Product= new mongoose.Schema({

   name:{
    type:String,
    required:[true,'product name is required']
   },
   slug:{
    type:String,
    required:[true,'product slug is required'],
    unique:true
   },
   price:{
    amount:{
        type:Number,
        required:true
    },
    compareAtPrice:Number,
    currency:{
        type:String,
        default:'USD'
    }
   },
   image:[{
    url:String,
    alt:String,
    isDefault:Boolean,
   }],

   variants: [{
    sku: String,
    name: String,
    price: Number,
    quantity: Number,
    attributes: [{
      name: String,
      value: String
    }]
  }],

   specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm'
      }
    },
    brand: String,
    manufacturer: String
  },
  category:{
    type:mongoose.Schema.ObjectId,
    ref:"Category",
    required:true
  },
  brand:{
    type:mongoose.Schema.ObjectId,
    ref:"Brand",
    required:true
  }

})

module.exports = mongoose.model('Product',Product)