const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

   title:{
    type:String,
    required:[true,'product title is required']
   },
   slug:{
    type:String,
    required:[true,'product slug is required'],
    unique:true
   },
   description:{
    type:String,
    required:true
   },
   price:{
    amount:{
        type:Number,
        required:true,
        min: [0, "Price amount must be positive"]
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
    brand:{
      type:mongoose.Schema.ObjectId,
      ref:"Brand",
      required:true
    },
  },
  category:{
    type:mongoose.Schema.ObjectId,
    ref:"Category",
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
    default:1
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

productSchema.virtual("discount").get(function(){
  if(this.price.compareAtPrice && (this.price.compareAtPrice > this.price.amount)){
    return Math.round(((this.price.compareAtPrice -this.price.amount) / this.price.compareAtPrice)*100) 
  }
  return 0; 
});

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name _id" });
  next();
});


module.exports = mongoose.model('Product',productSchema )