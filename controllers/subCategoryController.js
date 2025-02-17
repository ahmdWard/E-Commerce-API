const factory = require("../controllers/handlerFactory");
const SubCategory = require('../models/subCategoryModel');


// @desc  Get list of SubCategory
// @route GET /api/v1/subcategory
// @access Public
exports.getAllSubCategory = factory.getAll(SubCategory);

// @desc   Get specific SubCategory by id
// @route GET /api/v1/subcategory/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory,"category");

// @desc   Create SubCategory
// @route  POST /api/v1/subcategory
// @access Private/Admin-Manager
exports.createSubCategory = factory.createOne(SubCategory);

// @desc   Update specific SubCategory
// @route  patch /api/v1/subcategory
// @access Private/Admin-Manager
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete specific SubCategory
// @route  DELETE /api/v1/subcategory
// @access Private/Admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);