const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

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
  },
  subcategories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
  ],
  ratingsAverage: {
    type: Number,
    min: [1, "Rating must be above or equal 1.0"],
    max: [5, "Rating must be below or equal 5.0 "],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
 
},{ toJSON: { virtuals: true },
toObject: { virtuals: true },timestamps:true})


productSchema.virtual("reviews",{
  ref:"Review",
  foreignField:"product",
  localField:"_id"
})

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

module.exports = mongoose.model('Product',productSchema )