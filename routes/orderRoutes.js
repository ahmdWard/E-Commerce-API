const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

router.use(authController.protect)

router
.route('/:id')
.get(orderController.getOrder)
.patch(orderController.cancelOrder)


module.exports = router