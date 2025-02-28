const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

router.use(authController.protect)

router
.route('/:id')
.get(orderController.getOrder)
.patch(orderController.cancelOrder)

router
.route('/')
.get(authController.restrictTo('admin'),orderController.getallOrder)

router
.route('/checkout')
.post(orderController.createOrder)

router
.route('/:id/cancel')
.patch(orderController.cancelOrder)



module.exports = router