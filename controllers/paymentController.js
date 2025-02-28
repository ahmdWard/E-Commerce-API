const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/appError');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Transaction = require('../models/transactionModel');
const Cart = require('../models/cartModel');
const Shipping = require('../models/shipmentModel')
const { createCheckoutSession, getSessionStatus } = require('../utils/stripeGateway');


// @desc Create payment intent for Stripe
// @route POST /api/v1/payment/create-intent/:orderId
// @access Private/protect/user

exports.createPayment = catchAsync(async(req,res,next)=>{

    const {orderId} = req.params
    
    const order = await Order.findById(orderId)
    
    console.log(req.user._id,order.user);
    if(!order)
        return next(new AppError('Order not Found'),404)

    if(order.user.toString() !== req.user._id.toString())
        return next(new AppError('Not Authorized to access this order'),403)

    if (order.status !== 'pending') {
        return next(new AppError('Payment already processed for this order', 400));
      }
    
    const paymentSession = await createCheckoutSession(
        order.totalPrice,
        order.currency || 'usd',
        { order:orderId.toString(),user:req.user._id.toString()},
        req
    )

    if(!paymentSession.success)
        return next(new AppError(`Payment processing failed: ${paymentSession.error}`, 400)); 

    const payment = await Payment.create({
        user:req.user._id,
        order:orderId,
        currency:order.currency,
        paymentMethod:'stripe',
        transactionId:paymentSession.sessionId
    })

    res.status(200).json({
        status:"success",
        data:{
            checkoutUrl: paymentSession.checkoutUrl,
            paymentId:payment._id,
            sessionId:paymentSession.sessionId
        }
    })
})



// @desc Confirm payment after Stripe processing
// @route POST /api/v1/payment/confirm/:paymentId
// @access Private/protect/user

exports.confirmPayment = catchAsync(async(req,res,next)=>{

    const { paymentSessionId } = req.body;
    if(!paymentSessionId)
        return next(new AppError('payment intetnt ID not found',404))

    
    const {paymentId} = req.params

    const payment = await Payment.findById(paymentId)
    if (!payment) return next(new AppError('Payment not found', 404));

 

    if (payment.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to access this payment', 403));
      }
      
      if (payment.transactionId !== paymentSessionId) {
        return next(new AppError('Payment intent ID mismatch', 400));
      }

    const paymentResult = await getSessionStatus(paymentSessionId)

    if(!paymentResult.success){
        payment.status ='failed'
        await payment.save()

    const order = await Order.findById(payment.order)

    order.status = 'failed'
    await order.save()

     await Transaction.create({
        user:req.user._id,
        order:order._id,
        payment:payment._id,
        status:'Failed',
        gateWayResponse:paymentResult
    })
    return next(new AppError(`Payment verification failed: ${paymentResult.error}`, 400));
    }

    payment.status = 'completed'
    await payment.save()

    const order = await Order.findById(payment.order)
    order.status = 'proccessing'
    await order.save()
    
    console.log(order);
    

       const shipping = await Shipping.create({
            user: req.user._id,
            order: order._id,
            status: 'pending',
            // address: req.body.address || order.address
        });


     await Cart.findOneAndDelete({user:req.user._id})
    
    const transaction = await Transaction.create({
        user:req.user._id,
        order:order._id,
        payment:payment._id,
        status:'Success',
        gateWayResponse:paymentResult
    })

    res.status(200).json({
        success:"success",
        data:{
            transaction,
            order,
            payment,
            shipping
        }
    })


})

// @desc get payment datails
// @route Get /api/v1/payment/:paymentId
// @access Private/protect/user

exports.getPayment = catchAsync(async(req,res,next)=>{

    const { paymentId } = req.params
    const payment  = await Payment.findById(paymentId)

    if (!payment) return next(new AppError('Payment not found', 404));

    if (payment.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to access this payment', 403));
      }

     res.status(200).json({
    status: 'success',
    data: {
      payment
    }  
    })
})