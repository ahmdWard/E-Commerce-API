const mongoose = require('mongoose')
const catchAsync = require('../middleware/catchAsync')
const Cart = require('../models/cartModel');
const Inventory = require('../models/InventoryModel')
const AppError = require('../utils/appError');

// @desc  Add product to cart
// @route POST /api/v1/cart
// @access Protect/user

exports.addItemToCart = catchAsync(async(req,res,next)=>{
    
    const userId = req.user._id;
    const { product: productId, quantity } = req.body.products;
    
    if (!productId || !quantity || quantity <= 0) {
        return next(new AppError('Invalid product or quantity', 400));
    }


    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
        return next(new AppError('Product not found in inventory', 404));
    }
    
    if (inventory.stock < quantity) {
        return next(new AppError(`Only ${inventory.stock} items available`, 400));
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        let cart = await Cart.findOne({ user: userId }).session(session);
        
        if (!cart) {
            cart = await Cart.create([{
                user: userId,
                products: [{ product: productId, quantity }]
            }], { session });
            cart = cart[0]; 
        } else {
            await cart.addProduct(productId, quantity);
        }
        
        inventory.stock -= quantity;
        inventory.reservedStock += quantity;
        await inventory.save({ session });
        
        await session.commitTransaction();
        
        
        res.status(200).json({
            status: "success",
            data: {
                cartItemCount: cart.itemCount,
                totalQuantity:cart.totalQuantity,
                cart
            }
        });
    } catch (err) {
       
        await session.abortTransaction();
        return next(new AppError('Failed to update cart: ' + err.message, 500));
    } finally {
        session.endSession();
    }
});

// @desc  Remove product from wishlist
// @route DELETE /api/v1/cart/:productId
// @access Protect/user

exports.removeItemFromCart = catchAsync(async(req,res,next)=>{
    
    const productId = req.params.productId;
    
    if (!mongoose.isValidObjectId(productId)) {
        return next(new AppError('Invalid product ID', 400));
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    const productToRemove = cart.items.find(
        item => item.product.toString() === productId.toString()
    );
    
    if (!productToRemove) {
        return next(new AppError('Product not found in cart', 404));
    }
    
    const quantityToReturn = productToRemove.quantity;
    

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
       
        cart.items = cart.items.filter(item =>
            item.product.toString() !== productId.toString()
        );
        
        cart.lastModified = Date.now();
        await cart.save({ session });
        
       
        const inventory = await Inventory.findOne({ product: productId }).session(session);
        
        if (inventory) {
            inventory.reservedStock = Math.max(0, inventory.reservedStock - quantityToReturn);
            inventory.stock += quantityToReturn;
            await inventory.save({ session });
        }
        
       
        await session.commitTransaction();
        
      
        res.status(200).json({
            status: "success",
            message: "Item removed from cart",
            data: {
                itemCount: cart.items.length,
                totalPrice: cart.totalPrice,
                cart
            }
        });
    } catch (error) {
        
        await session.abortTransaction();
        return next(new AppError(error.message, 400));
    } finally {
        
        session.endSession();
    }
});


// @desc  get cart 
// @route GET /api/v1/cart
// @access Protect/user
exports.getCart = catchAsync(async(req,res,next)=>{

    const userId = req.user._id
    const cart = await Cart.findOne({user:userId});

    if (!cart) return next(new AppError("No cart exists", 404));

    res.status(200).json({
        status:"success",
        numberOfItems: cart.items.length,
        data:{
            cart
        }
    })


})


// @desc  update product quantity of cart
// @route PATCH /api/v1/cart/:productId
// @access Protect/user
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    if (!mongoose.isValidObjectId(productId)) {
        return next(new AppError('Invalid product ID', 400));
    }
    
    if (!Number.isInteger(quantity)) {
        return next(new AppError('Quantity must be an integer', 400));
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }
    
    const productItem = cart.items.find(item => 
        item.product.toString() === productId.toString()
    );
    
    if (!productItem) {
        return next(new AppError('Product not found in cart', 404));
    }
    
    const quantityDifference = quantity - productItem.quantity;
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => 
                item.product.toString() !== productId.toString()
            );
        } else {
            productItem.quantity = quantity;
        }
        
        await cart.save({ session });
        
        if (quantityDifference !== 0) {
            const inventory = await Inventory.findOne({ product: productId }).session(session);
            
            if (inventory) {
                if (quantityDifference > 0) {
                    if (inventory.stock < quantityDifference) {
                        throw new Error(`Only ${inventory.stock} items available`);
                    }
                    inventory.stock -= quantityDifference;
                    inventory.reservedStock += quantityDifference;
                } else {
                    const absQuantityDiff = Math.abs(quantityDifference);
                    inventory.reservedStock = Math.max(0, inventory.reservedStock - absQuantityDiff);
                    inventory.stock += absQuantityDiff;
                }
                
                await inventory.save({ session });
            }
        }
        
        await session.commitTransaction();
        
        res.status(200).json({
            status: 'success',
            data: {
                itemCount: cart.itemCount,
                totalPrice: cart.totalPrice,
                cart
            }
        });
    } catch (error) {
        await session.abortTransaction();
        return next(new AppError(error.message, 400));
    } finally {
        session.endSession();
    }
});

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
  