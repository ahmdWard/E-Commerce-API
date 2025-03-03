const Cateogory = require('../models/categoryModel')
const factory = require("../controllers/handlerFactory");

// @desc  Get list of categories
// @route GET /api/v1/categories
// @access Public
exports.getAllCategories = factory.getAll(Cateogory);

// @desc   Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Cateogory);

// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private/Admin-Manager
exports.createCategory = factory.createOne(Cateogory);

// @desc   Update specific category
// @route  patch /api/v1/categories
// @access Private/Admin-Manager
exports.updateCategory = factory.updateOne(Cateogory);

// @desc   Delete specific category
// @route  DELETE /api/v1/categories
// @access Private/Admin-manager
exports.deleteCategory = factory.deleteOne(Cateogory);