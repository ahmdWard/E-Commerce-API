const Review = require ('../models/reviewModel')
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../middleware/catchAsync');
const review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const { listeners } = require('../app');


// @desc  Get list of reviews
// @route GET /api/v1/review
// @access Public
exports.getAllReviews = factory.getAll(Review);

// @desc  Get specific review by id
// @route GET /api/v1/review/:id
// @access Public
exports.getReview = factory.getOne(Review);

// @desc   Update specific review
// @route  PUT /api/v1/reviews/:id
// @access Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc   Delete specific review
// @route  DELETE /api/v1/review/:id
// @access Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);

// @desc  Create review
// @route POST /api/v1/review
// @access Private/Protect/User
exports.createReview = catchAsync(async(req,res,next)=>{


   const  {user , product} = req.body

   let document = await review.findOne({user:user,product:product})

   if(document)
    return next(new AppError(
            `you can't create more than one review to the same product`
            ,401))
    else{
    document=  await review.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
            document
        }

    })
    }

})