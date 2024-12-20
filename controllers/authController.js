
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AppError = require('../utilts/appError')
const { promisify } = require('util');
const catchAsync = require('../middleware/catchAsync')


exports.protect = catchAsync(async(req,res,next)=>{

    let token

    if(req.headers.authorization||!req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1]
   
    if(!token)
        return next(new AppError('login first to get the access')) 

    console.log(token)

    const decoded = await promisify (jwt.verify)(token,process.env.JWT_SECRET)
    
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = currentUser
    next()
})


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
