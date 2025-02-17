const catchAsync = require('../middleware/catchAsync')
const appError = require('../utils/appError')
const Product = require('../models/productModel')
const ApiFeatures = require('../utils/apiFeatures')
const factory = require('../controllers/handlerFactory')

// @desc   CREATE product
// @route POST /api/v1/products
// @access Public

exports.createProduct = factory.createOne(Product)

// @desc   Get list of products
// @route GET /api/v1/products
// @access Public

exports.getAllProducts = factory.getAll(Product ,"product")


// @desc   Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product)

// @desc   UPDATE specific product by id
// @route Patch /api/v1/products/:id
// @access Public
exports.updateProduct = factory.updateOne(Product)
// @desc   DELETE specific product by id
// @route DELETE /api/v1/products/:id
// @access Public

exports.deleteProduct = factory.deleteOne(Product)