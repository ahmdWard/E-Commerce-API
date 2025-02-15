const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')


router
.route('/')
.post(productController.createProduct)
.get(productController.getAllProducts)

router
.route('/:id')
.get(productController.getProduct)
.patch(productController.updateProduct)
.delete(productController.deleteProduct)

module.exports = router