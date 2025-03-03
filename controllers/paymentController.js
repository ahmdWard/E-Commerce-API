const mongoose= require('mongoose')
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/appError');
const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Transaction = require('../models/transactionModel');
const Cart = require('../models/cartModel');
const Shipping = require('../models/shippingModel')
const Inventory =  require('../models/InventoryModel')
const factory = require('../controllers/handlerFactory')
const { createCheckoutSession, getSessionStatus } = require('../utils/stripeGateway');


// @desc Create payment intent for Stripe
// @route POST /api/v1/payment/create-intent/:orderId
// @access Private/protect/user

exports.createPayment = catchAsync(async(req,res,next)=>{

    const {orderId} = req.params

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(new AppError('Invalid order ID', 400));
    }
    
    const order = await Order.findById(orderId)
    
    if(!order)
        return next(new AppError('Order not Found',404))

    if(order.user.toString() !== req.user._id.toString())
        return next(new AppError('Not Authorized to access this order',403))

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
            sessionId:paymentSession.sessionId,
            orderId: order._id,
            paymentStatus: 'pending'
        }
    })
})



// @desc Confirm payment after Stripe processing
// @route POST /api/v1/payment/confirm/:paymentId
// @access Private/protect/user

exports.confirmPayment = catchAsync(async(req,res,next)=>{

    const { paymentSessionId } = req.body;
    if(!paymentSessionId)
        return next(new AppError('payment intetnt ID not found',400))

    
    const {paymentId} = req.params

    if (!mongoose.isValidObjectId(paymentId)) {
        return next(new AppError('Invalid payment ID', 400));
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();


    try {

    const payment = await Payment.findById(paymentId)
    if (!payment) return next(new AppError('Payment not found', 404));

 

    if (payment.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to access this payment', 403));
      }
      
      if (payment.transactionId !== paymentSessionId) {
        return next(new AppError('Payment intent ID mismatch', 400));
      }

      if (payment.status === 'completed') {
        return next(new AppError('Payment already processed', 400));
    }
    

    const paymentResult = await getSessionStatus(paymentSessionId)

    const order = await Order.findById(payment.order).session(session);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    const transactionData = {
        user: req.user._id,
        order: order._id,
        payment: payment._id,
        gateWayResponse: paymentResult,
        createdAt: new Date()
    };
    

    if(!paymentResult.success){
        payment.status = 'failed';
            await payment.save({ session });
            
            order.status = 'failed';
            await order.save({ session });
            
            transactionData.status = 'Failed';
            await Transaction.create([transactionData], { session });
            
         return next(new AppError(`Payment verification failed: ${paymentResult.error}`, 400));
    }

    payment.status = 'completed';
    await payment.save({ session });
    
    order.status = 'processing';  
    await order.save({ session });
    

    const orderItems = order.items;
        for (const item of orderItems) {
            const inventory = await Inventory.findOne({ product: item.product }).session(session);

            if (!inventory) {
                throw new AppError(`Inventory not found for product: ${item.product}`, 404);
            }

            inventory.reservedStock -= item.quantity;
            inventory.sold += item.quantity;
            await inventory.save({ session });
        }
    
       const { address } = req.body

       const shipping = await Shipping.create({
            user: req.user._id,
            order: order._id,
            status: 'pending',
            address: address || order.address
        });


        await Cart.findOneAndDelete({ user: req.user._id }).session(session);    

        transactionData.status = 'Success';
        const transaction = await Transaction.create([transactionData], { session });
        

        await session.commitTransaction();
        session.endSession();

    res.status(200).json({
        success:"success",
        data:{
            transaction,
            order,
            payment,
            shipping
        }
    })

    } catch (error) {
        await session.abortTransaction();
        return next(new AppError(`Payment confirmation failed: ${error.message}`, 500));
    }finally {
        
        session.endSession();
    }

    

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



// @desc get  all payments datails
// @route Get /api/v1/payment
// @access Private/protect/admin
exports.getAllPayments =factory.getAll(Payment)