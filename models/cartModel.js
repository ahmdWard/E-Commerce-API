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
          }
        }
      ],
      totalPrice:{
        type:Number,
        default:0
      }
})

cartSchema.methods.calcTotalPrice = async function(){

     await this.populate('items.product');

     this.totalPrice = this.items.reduce((sum,item)=>{
       return sum + item.quantity * item.product.price.amount 
     },0)
}

cartSchema.methods.addProduct = async function(productId,quantity) {
    
    const productIndex = this.items.findIndex(
        item => item.product.toString() === productId.toString() 
    )

    if(productIndex > -1){
        this.items[productIndex].quantity += quantity;
    }else{
        this.items.push({product:productId,quantity:quantity})
    }

    await this.save();
}


cartSchema.methods.updateNumberOfItems =async function(productId,quantity) {

    const productIndex = this.items.findIndex(
      item => item.product.toString() === productId.toString()
    )

    
    if (productIndex > -1) {
      if (quantity <= 0) {
        this.items.splice(productIndex, 1); 
    } else {
        this.items[productIndex].quantity = quantity;
      }
    }
    await this.save()
}


cartSchema.pre('save',async function(next){
  await this.calcTotalPrice()
  next()
})

const cart = mongoose.model('Cart',cartSchema)

module.exports = cart