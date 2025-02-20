
const catchAsync = require('../middleware/catchAsync')
const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');


// @desc  Add product to cart
// @route POST /api/v1/cart
// @access Protect/user

exports.addItemToCart = catchAsync(async(req,res,next)=>{
    
    const userId = req.user._id
    const  productId  = req.body.products.product;
    const  quantity = req.body.products.quantity;

    let cart = await Cart.findOne({user:userId})

    if(!cart){
        cart = await Cart.create({
            user:userId,
            products: [{product: productId,quantity:quantity}]
        })
    }else{
        await cart.addProduct(productId)
    }

    res.status(200).json({
        status:"success",
        numberOfItems: cart.products.length,
        data:{
            cart
        }
    })
})

// @desc  Remove product from wishlist
// @route DELETE /api/v1/cart/:productId
// @access Protect/user

exports.removeItemFromCart = catchAsync(async(req,res,next)=>{
    
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
          $pull: { products: { product: req.params.productId } },
        },
        { new: true, runValidators: true }
      );
    
      await cart.save();
    res.status(200).json({
        status:"success",
        numberOfItems: cart.products.length,
        data:{
            cart
        }
    })
})


// @desc  get cart 
// @route GET /api/v1/cart
// @access Protect/user
exports.getCart = catchAsync(async(req,res,next)=>{

    const userId = req.user._id
    const cart = await Cart.findOne({user:userId});

    if (!cart) return next(new AppError("No cart exists", 404));

    res.status(200).json({
        status:"success",
        numberOfItems: cart.products.length,
        data:{
            cart
        }
    })


})


// @desc  update product quantity of cart
// @route PATCH /api/v1/cart/:productId
// @access Protect/user
exports.updateCartItemQuantity = catchAsync(async(req,res,next)=>{

    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const { productId } = req.params

    await cart.updateNumberOfItems(productId,quantity)

    res.status(200).json({
        status: 'success',
        numberOfItems: cart.products.length,
        data: cart,
      });
})


// @desc  Remove all cart
// @route DELETE /api/v1/cart
// @access Protect/user

exports.clearCart = catchAsync(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });
  
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
  