const User = require('../models/userModel')
const catchAsync = require('../middleware/catchAsync')

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