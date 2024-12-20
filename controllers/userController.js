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
    
    return(new AppError(
        'this route is not for creating accounts. Please use /signUp.'
        ,400
    ))
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

exports.updateMe = catchAsync(async(req,res,next)=>{

    const {firstname,lastname,phone,email} = req.body
    
    const {password,passwordconfirm} = req.body

    if(password||passwordconfirm)
         return (new AppError('This route is not for password updates. Please use /changePassword.',400))

    const user = await User.findByIdAndUpdate({_id:req.user.id},{
        firstname,
        lastname,
        phone,
        email
    },{
        new:true,
        runValidtors:true
    })

    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})


exports.deleteUser = catchAsync(async(req,res,next)=>{

    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if(!deletedUser)
        next(new AppError('this user is not found',404))
    
    res.status(204).json({
        status:"success"
    })
})