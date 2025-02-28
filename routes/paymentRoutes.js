const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const paymentController = require('../controllers/paymentController')

router.use(authController.protect)


router
.route('/create-intent/:orderId')
.post(paymentController.createPayment)


router
.route('/confirm/:paymentId')
.post(paymentController.confirmPayment)

router
.route('/:paymentId')
.get(paymentController.getPayment)


module.exports  = router