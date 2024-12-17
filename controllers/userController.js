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
    
    const newUser = await User.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
             newUser
        }
    })
})

exports.getUser = catchAsync(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user)
       return next(new AppError('this user is not found',404))

    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})

exports.updateUser = catchAsync(async(req,res,next)=>{

    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        phone:req.body.phone
    })

    if(!updatedUser)
       return next(new AppError('this user is not found',500))

    res.status(200).json({
        status:"success",
        data:{
            updatedUser
        }
    })
})