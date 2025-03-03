const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authController = require('../controllers/authController')

router
.route('/')
.post(authController.protect,authController.restrictTo('admin','manager'),productController.createProduct)
.get(productController.getAllProducts)

router
.route('/:id')
.get(productController.getProduct)
.patch(authController.protect,authController.restrictTo('admin','manager'),productController.updateProduct)
.delete(authController.protect,authController.restrictTo('admin','manager'),productController.deleteProduct)

module.exports = router