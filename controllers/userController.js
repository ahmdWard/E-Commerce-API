const User = require('../models/userModel')
const catchAsync = require('../middleware/catchAsync')
const AppError= require('../utils/appError')


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
    
    return next(new AppError(
        'this route is not for creating accounts. Please use /signUp.'
        ,400
    ))
})

exports.getUser = catchAsync(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user)
       return next(new AppError(
    'this user is not found'
    ,404))

    res.status(200).json({
        status:"success",
        data:{
            user
        }
    })
})

exports.updateMe = catchAsync(async(req,res,next)=>{

    const {firstname,lastname,phone,email,address} = req.body
    
    const {password,passwordconfirm} = req.body

    if(password||passwordconfirm)
         return next (new AppError(
        'This route is not for password updates. Please use /changePassword.'
        ,400))

    const user = await User.findByIdAndUpdate({_id:req.user.id},{
        firstname,
        lastname,
        phone,
        email,
     $push : { address: req.body.address }
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

exports.deleteMe = catchAsync(async(req,res,next)=>{

    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
      });
    
})


exports.deleteUser = catchAsync(async(req,res,next)=>{

    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if(!deletedUser)
        next(new AppError('this user is not found',404))
    
    res.status(204)
})


exports.block = catchAsync(async(req,res,next)=>{
   
     await User.findByIdAndUpdate(req.params.id,{isBlocked:true},{
       new:true,
       runValidators:true 
    })

    res.status(200).json({
        status:"success",
    })

})

exports.unBlock = catchAsync(async(req,res,next)=>{
    
    await User.findByIdAndUpdate(req.params.id,{isBlocked:false},{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        status:"success"
    })

})