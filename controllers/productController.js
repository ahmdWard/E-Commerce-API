const catchAsync = require('../middleware/catchAsync')
const appError = require('../utilts/appError')
const Product = require('../models/productModel')

exports.createProduct = catchAsync(async(req,res,next)=>{

    const newProduct = await Product.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
            newProduct
        }
    })
})

exports.getAllProducts = catchAsync(async(req,res,next)=>{

    const products = await Product.find()

    res.status(200).json({
        status:'success',
        length:products.length,
        data:{
            products
        }
    })
})

exports.getProduct = catchAsync(async(req,res,next)=>{

    const product = await Product.findById(req.params.id)

    if(!product)
        return next(new appError('product is not found',404))

    res.status(200).json({
        status:'success',
        data:{
            product
        }
    })
})

exports.updateProduct = catchAsync(async(req,res,next)=>{

    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
    })
    
    if(!product)
        return next(new appError('product is not found 404',404))

    res.status(200).json({
        status:'success',
        data:{
            product
        }
    })
})

exports.deleteProduct = catchAsync(async(req,res,next)=>{

    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product)
        return next(new appError('product is not found 404',404))

    res.status(204).json({
        status:'success'
    })
})
