const mongoose = require('mongoose')
const catchAsync = require('../middleware/catchAsync')
const AppError = require('../utils/appError')
const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')
const User = require('../models/userModel')
const factory = require('../controllers/handlerFactory')


// @desc get an  order
// @route get /api/v1/order/:id
// @access Private/protect/user
exports.getOrder = factory.getOne(Order)


// @desc get all order
// @route get /api/v1/order
// @access Private/protect/admin
exports.getallOrder = factory.getAll(Order)


// @desc cancel an order
// @route PATCH /api/v1/order/:id/cancel
// @access Private/protect/user
exports.cancelOrder = catchAsync(async(req,res,next)=>{

    const  {orderId} = req.params

    // if (!mongoose.Types.ObjectId.isValid(orderId)) {
    //     return next(new AppError('Invalid order ID', 400));
    // }

    const order = await Order.findOne(orderId)


    if(!order)
        return next (new AppError('There is no order for now',404))

    if(order.user.toString()!==req.user._id.toString()){
        return next(new AppError('This order is not for that user',403))
    }

    const allowedStatuses = ['pending', 'shipped', 'cancelled','proccessing'];
    if (!allowedStatuses.includes(order.status)) {
        return next(new AppError('Invalid order status', 400));
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
// @route POST /api/v1/order/checkout
// @access Private/protect/user
exports.createOrder = catchAsync(async(req,res,next)=>{
    
    const userId = req.user._id;
    const { paymentMethod = 'stripe', address } = req.body;

   const existingOrder = await Order.findOne({ user: userId });
    if (existingOrder) {
        return next(new AppError('Order is already created for this user', 400));
    }

    const cart = await Cart.findOne({user:userId}).populate('items.product')

    if(!cart || cart.items.length===0)
        return next (new AppError('cart is empty'),404)

    if (!address) {
        return next(new AppError('Please provide a delivery address', 400));
    }
     
      
    const orderItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price.amount,
      }));

     const order = await Order.create({
        user:userId,
        items:orderItems,
        totalPrice:cart.totalPrice,
        paymentMethod,
        address:address
    })

    res.status(201).json({
        status:'success',
        data:{
            order
        }
    })
})