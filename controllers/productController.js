const catchAsync = require('../middleware/catchAsync')
const appError = require('../utilts/appError')
const Product = require('../models/productModel')
const ApiFeatures = require('../utilts/apiFeatures')


// @desc   CREATE product
// @route POST /api/v1/products
// @access Public

exports.createProduct = catchAsync(async(req,res,next)=>{

    const newProduct = await Product.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
            newProduct
        }
    })
})

// @desc   Get list of products
// @route GET /api/v1/products
// @access Public

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const documentCounts = await Product.countDocuments();
    
    const features = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .paginate(documentCounts)
    .limitFields();

    const products = await features.moongoseQuery; 

    res.status(200).json({
        status: 'success',
        length: products.length,
        data: {
            products
        }
    });
});


// @desc   Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
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

// @desc   UPDATE specific product by id
// @route Patch /api/v1/products/:id
// @access Public
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

// @desc   DELETE specific product by id
// @route DELETE /api/v1/products/:id
// @access Public

exports.deleteProduct = catchAsync(async(req,res,next)=>{

    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product)
        return next(new appError('product is not found 404',404))

    res.status(204).json({
        status:'success'
    })
})
