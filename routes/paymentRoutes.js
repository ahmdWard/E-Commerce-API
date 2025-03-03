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

router
.route('/')
.get(paymentController.getAllPayments)


module.exports  = router