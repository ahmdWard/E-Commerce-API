
const User = require('../models/userModel')
const AppError = require('../utilts/appError')
const catchAsync = require('../middleware/catchAsync')

exports.login = catchAsync(async(req,res,next)=>{
   
    const {email , password} = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email })
    if(!user)
       return next(new AppError('Email or password is not correct',403))

    console.log(password,user.password)
    if(!user.comparePassword(password,user.password))
      return  next(new AppError('Email or password is not correct',403))

    res.status(200).json({
        status:"success",
        message: 'Logged in successfully'
    })

})

