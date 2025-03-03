const factory = require("../controllers/handlerFactory");
const Brand = require('../models/brandModel');


// @desc  Get list of brand
// @route GET /api/v1/brand
// @access Public
exports.getAllBrand = factory.getAll(Brand);

// @desc   Get specific brand by id
// @route GET /api/v1/brand/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc   Create brand
// @route  POST /api/v1/brand
// @access Private/Admin-Manager
exports.createBrand = factory.createOne(Brand);

// @desc   Update specific brand
// @route  patch /api/v1/brand
// @access Private/Admin-Manager
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete specific brand
// @route  DELETE /api/v1/brand
// @access Private/Admin-manager
exports.deleteBrand = factory.deleteOne(Brand);