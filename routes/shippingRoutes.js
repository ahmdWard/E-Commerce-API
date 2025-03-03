const express = require('express');
const router = express.Router();

const shippingController = require('../controllers/shippingController')
const authController =require('../controllers/authController')

router.use(authController.protect)

router
.route('/')
.get(shippingController.getAllshipping)




module.exports = router
