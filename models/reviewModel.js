const { default: mongoose } = require("mongoose");
const Product = require('../models/productModel')

const reviewSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String
    },
    rating:{
        type:Number,
        min:[1,"Min rating value is 1"],
        max:[5,"max rating value is 5"],
        required: [true, "Review ratings required"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: [true, "Review must belong to user"]
        },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required: [true, "Review must belong to product"]
    }
},{timestamps:true})


reviewSchema.statics.calcAvgRatingAndQuantity = async function(productId){
    const result = await this.aggregate([
        {
            $match:{product:productId}
        },
        {
            $group:{
                _id:"product",
                avgRatings: { $avg: "$rating" },
                ratingsQuantity: { $sum: 1 },
            }
        }
    ])

    if(result.length > 0){
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    }else{
        await Product.findByIdAndUpdate(productId,{
            ratingsAverage:0,
            ratingsQuantity:0
        })
    }
}
reviewSchema.post("save", async function () {
    await this.constructor.calcAvgRatingAndQuantity(this.product);
  });

  reviewSchema.post(
    "deleteOne",
    { document: true, query: false },
    async function () {
      await this.constructor.calcAvgRatingAndQuantity(this.product);
    }
  );
const review = mongoose.model('Review',reviewSchema)

module.exports = review