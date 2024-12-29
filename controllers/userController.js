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

    const {firstname,lastname,phone,email} = req.body
    
    const {password,passwordconfirm} = req.body

    if(password||passwordconfirm)
         return next (new AppError(
        'This route is not for password updates. Please use /changePassword.'
        ,400))

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

exports.deleteMe = catchAsync(async(req,res,next)=>{

    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
      });
    
})


exports.changePassword = catchAsync(async(req,res,next)=>{

    const {currentPassword,newPassword,passwordconfirm} = req.body

    if (!currentPassword || !newPassword || !passwordconfirm) {
        return next(new AppError(
            'All fields are required'
            , 400));
    }


    const user = await User.findById({_id:req.user.id}).select("+password")

    if (!user) {
        return next(new AppError('User not found', 404));
    }



    if(!user.comparePassword(currentPassword,user.password))
        return next(new AppError(
    'the current password is not the right'
    ,403))
    

    if(await user.comparePassword(newPassword,user.password))
        return next(new AppError(
            `you cann't set your current password as your new password`
            ,400))

    
    if (newPassword !== passwordconfirm) {
        return next(new AppError(
            'Password confirmation does not match'
            , 400));
    }
    
    user.password = newPassword;
    user.passwordconfirm = passwordconfirm
    user.passwordChangedAt = Date.now()
    await user.save();

    res.status(200).json({
        status:"success"
    })

})



exports.deleteUser = catchAsync(async(req,res,next)=>{

    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if(!deletedUser)
        next(new AppError('this user is not found',404))
    
    res.status(204)
})