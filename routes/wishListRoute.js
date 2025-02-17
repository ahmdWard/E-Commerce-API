const express = require('express');
const router = express.Router();

const wishListController = require('../controllers//wishListController');
const authController = require('../controllers/authController');

router.use(authController.protect)

router
.route('/')
.get(wishListController.getWishList)
.post(wishListController.addProductToWishList)

router
.route('/:productId')
.patch(wishListController.removeProductFromWishList)

module.exports = router;
