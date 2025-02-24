const catchAsync = require('../middleware/catchAsync')
const AppError = require('../utils/appError')
const Order = require('../models/orderModel')
const Transaction = require('../models/transactionModel')
const Shipping = require('../models/shipmentModel')
const Payment = require('../models/paymentModel')
const Cart = require('../models/cartModel')
const factory = require('../controllers/handlerFactory')
const User = require('../models/userModel')

// @desc get an  order
// @route get /api/v1/order/:id
// @access Private/protect/user

exports.getOrder = factory.getOne(Order)


// @desc get all order
// @route get /api/v1/order
// @access Private/protect/admin


exports.getallOrder = factory.getAll(Order)


// @desc cancel an order
// @route PATCH /api/v1/order/:id
// @access Private/protect/user

exports.cancelOrder = catchAsync(async(req,res,next)=>{

    const order = await Order.findOne(req.params.orderId)

    if(!order)
        return next (new AppError('There is no order for now',404))

    if(order.user.toString()!==req.user._id){
        return next(new AppError('This order is not for that user',403))
    }


    if(order.status !== 'pending'){
        return next (new AppError('you can not cancel the order, it is already shipped',400))
         }

    order.status = 'cancelled';
    await order.save();
    

    res.status(200).json({
        status:'success',
        data:{
            order
        }
    })

})

// @desc create an order
// @route PATCH /api/v1/order/checkout
// @access Private/protect/user


exports.createOrder =catchAsync(async(req,res,next)=>{
    
    const user = await User.findById(req.user._id).lean(); 
    const cart = await Cart.findOne({user:req.user._id})
    

    if(!cart || cart.length===0)
        return next (new AppError('cart is empty'),404)

  
    const orderItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price.amount,
      }));

    const order = await Order.create({
        user:req.user._id,
        items:orderItems,
        totalPrice:cart.totalPrice,
        paymentMethod:req.body.paymentMethod||'COD',
        address:user.mainAddress
    })

    res.status(201).json({
        status:'success',
        data:{
            order
        }
    })
})