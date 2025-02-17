const express = require('express');
const router = express.Router();

const subcategory = require('../controllers/subCategoryController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(subcategory.getAllSubCategory)
  .post(authController.protect, authController.restrictTo('admin'), subcategory.createSubCategory);

router
  .route('/:id')
  .get(subcategory.getSubCategory)
  .patch(authController.protect, authController.restrictTo('admin'), subcategory.updateSubCategory)
  .delete(authController.protect, authController.restrictTo('admin'), subcategory.deleteSubCategory);

module.exports = router;
