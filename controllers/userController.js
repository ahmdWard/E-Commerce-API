const User = require('../models/userModel')
const catchAsync = require('../middleware/catchAsync')
const AppError= require('../utilts/appError')


exports.getAllUsers  = catchAsync(async(req,res,next)=>{

    const users = await User.find()

    res.status(200).json({
        status:"success",
        length:users.length,
        data:{
            users
        }
    })
})

exports.createUser = catchAsync(async(req,res,next)=>{
    
    const user = await User.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
             user
        }
    })
})

exports.getUser = catchAsync(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user)
        next(new AppError('this user is not found',404))

    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})