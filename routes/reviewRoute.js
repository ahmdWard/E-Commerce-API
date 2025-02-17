const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController')
const authController =require('../controllers/authController')

router.use(authController.protect)

router
.route('/')
.post(reviewController.createReview)
.get(reviewController.getAllReviews)


router
.route('/:id')
.get(reviewController.getReview)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview)


module.exports = router
