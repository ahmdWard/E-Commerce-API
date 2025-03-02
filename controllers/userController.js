const User = require('../models/userModel')
const catchAsync = require('../middleware/catchAsync')
const AppError= require('../utils/appError')


// @desc  Get list of users
// @route GET /api/v1/user
// @access private/admin
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


// @desc  create  user
// @route POST /api/v1/user
// @access public/user
exports.createUser = catchAsync(async(req,res,next)=>{
    
    return next(new AppError(
        'this route is not for creating accounts. Please use /signUp.'
        ,400
    ))
})


// @desc  Get a specific user
// @route GET /api/v1/user/:id
// @access private/user
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

// @desc  update user
// @route PATCH /api/v1/user/:id
// @access private/user

exports.updateMe = catchAsync(async(req,res,next)=>{

    const { firstname, lastname, phone, email, address } = req.body
    
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
        address
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

// @desc  unactive user
// @route POST /api/v1/user/:id
// @access private/user
exports.deleteMe = catchAsync(async(req,res,next)=>{

    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
      });
    
})


// @desc  delete user
// @route DELETE /api/v1/user/:id
// @access private/admin
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