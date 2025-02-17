const catchAsync = require('../middleware/catchAsync')
const AppError = require('../utils/appError')
const WishList = require('../models/wisListModel')




// @desc  Add product to wishlist
// @route POST /api/v1/wishlist
// @access Protect/user
exports.addProductToWishList = catchAsync(async(req,res,next)=>{
    const {productId} = req.body

    if(!productId)
        return next(new AppError(
            'product ID is required',400
        ))

    const document = await WishList.findOneAndUpdate(
        {user:req.user._id},
        {$addToSet : {product:productId}},
        {new:true,upsert: true}
    )
    
    res.status(200).json({
        status:"success",
        data:{
            document
        }
    })

})

// @desc  Remove product from wishlist
// @route PATCH /api/v1/wishlist/:productId
// @access Protect/user

exports.removeProductFromWishList = catchAsync(async(req,res,next)=>{

    const {productId} = req.params

    if(!productId)
        return next(new AppError(
            'product ID is required',400
        ))

    const document = await WishList.findOneAndUpdate(
        {user:req.user._id},
        {$pull : {product:productId}},
        { new: true }
    )
    
    res.status(200).json({
        status:"success",
        data:{
            document
        }
    })

})


// @desc  get user  wishlist
// @route get /api/v1/wishlist
// @access Protect/user

exports.getWishList = catchAsync(async(req,res,next)=>{

    const wishList = await WishList.findOne({user:req.user._id})
    if(!wishList)
        return next(new AppError(
            'no wishList found for this user' , 404
        ))

        res.status(200).json({
            status:"success",
            length:wishList.length,
            data:{
                wishList
            }
        })
})
