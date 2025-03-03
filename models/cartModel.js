const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
  
    user:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:true
    },
    items: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
          },
          addedAt: { type: Date, default: Date.now }
        }
      ],
      totalPrice:{
        type:Number,
        default:0
      },
      lastModified: {
        type: Date,
        default: Date.now
      }
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

cartSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

cartSchema.virtual('totalQuantity').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

cartSchema.methods.calcTotalPrice = async function(){

      await this.populate({
        path: 'items.product',
        select: 'price'
      });

     this.totalPrice = this.items.reduce((sum,item)=>{
       return sum + (item.quantity * item.product.price.amount) 
     },0)
}

cartSchema.methods.addProduct = async function(productId,quantity) {
    
  if (!mongoose.isValidObjectId(productId)) {
    throw new Error('Invalid product ID');
  }
  
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Quantity must be a positive integer');
  }

    const productIndex = this.items.findIndex(
        item => item.product.toString() === productId.toString() 
    )

    if(productIndex > -1){
        this.items[productIndex].quantity += quantity;
    }else{
        this.items.push({product:productId,quantity:quantity})
    }

   this.lastModified = Date.now();
  return this.save();
}

cartSchema.pre('save',async function(next){
  await this.calcTotalPrice()
  next()
})

const cart = mongoose.model('Cart',cartSchema)

module.exports = cart