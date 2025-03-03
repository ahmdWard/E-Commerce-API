const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brandController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(brandController.getAllBrand)
  .post(authController.protect, authController.restrictTo('admin','manager'), brandController.createBrand);

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(authController.protect, authController.restrictTo('admin','manager'), brandController.updateBrand)
  .delete(authController.protect, authController.restrictTo('admin','manager'), brandController.deleteBrand);

module.exports = router;
