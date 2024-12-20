
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AppError = require('../utilts/appError')
const catchAsync = require('../middleware/catchAsync')

exports.login = catchAsync(async(req,res,next)=>{
   
    const {email , password} = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    
    const user = await User.findOne({ email }).select("+password")
    if(!user)
       return next(new AppError('Email or password is not correct',403))

    console.log(password,user.password)
    if(!user.comparePassword(password,user.password))
      return  next(new AppError('Email or password is not correct',403))

    const token = jwt.sign({ id:user.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRATION
       })  

    res.status(200).json({
        status:"success",
        message: 'Logged in successfully',
        token
    })

})

exports.signUp = catchAsync(async(req,res,next)=>{
    const { firstname, lastname , email, phone, password, passwordconfirm ,role } = req.body;

    if (!firstname ||!lastname || !email || !phone || !password || !passwordconfirm) {
         return next(new AppError('All fields are required', 400));
    }

    const newUser = await User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password,
        passwordconfirm,
        role, 
    });

    res.status(201).json({
        status:'success',
        data:{
            newUser
        }
    })
    
})
