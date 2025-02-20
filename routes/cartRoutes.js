const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController')
const authController = require('../controllers/authController');

router.use(authController.protect)

router
.route('/')
.get(cartController.getCart)
.post(cartController.addItemToCart)
.delete(cartController.clearCart)


router
.route('/:productId')
.patch(cartController.updateCartItemQuantity)
.delete(cartController.removeItemFromCart)

module.exports = router;
