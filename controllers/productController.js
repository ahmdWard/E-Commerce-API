const Product = require('../models/productModel')
const factory = require('../controllers/handlerFactory')

// @desc   CREATE product
// @route POST /api/v1/products
// @access private admin-manager
exports.createProduct = factory.createOne(Product)

// @desc   Get list of products
// @route GET /api/v1/products
// @access Public
exports.getAllProducts = factory.getAll(Product ,"product")


// @desc   Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product,"reviews")

// @desc   UPDATE specific product by id
// @route Patch /api/v1/products/:id
// @access private admin-manager
exports.updateProduct = factory.updateOne(Product)

// @desc   DELETE specific product by id
// @route DELETE /api/v1/products/:id
// @access private admin-manager
exports.deleteProduct = factory.deleteOne(Product)