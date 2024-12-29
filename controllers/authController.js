
const jwt = require('jsonwebtoken')
const crypto = require ('crypto')
const { promisify } = require('util');
const User = require('../models/userModel')
const AppError = require('../utilts/appError')
const catchAsync = require('../middleware/catchAsync');
const sendEmail = require('../utilts/sendEmail')

exports.protect = catchAsync(async(req,res,next)=>{

    let token

    if(req.headers.authorization||!req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1]
   
    if(!token)
        return next(new AppError(
    'login first to get the access'
    ,401)) 

    const decoded = await promisify (jwt.verify)(token,process.env.JWT_SECRET)
    
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(new AppError(
            'The user belonging to this token does no longer exist.'
            , 401));
    }

    req.user = currentUser
    next()
})


exports.login = catchAsync(async(req,res,next)=>{
   
    const {email , password} = req.body

    if (!email || !password) {
        return next(new AppError(
            'Please provide email and password'
            , 400));
    }

    const user = await User.findOne({ email }).select("+password")
    if(!user)
       return next(new AppError(
    'Email or password is not correct'
    ,403))


    if(! await user.comparePassword(password,user.password))
      return  next(new AppError(
    'Email or password is not correct'
    ,403))

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
         return next(new AppError(
            'All fields are required',
             400));
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


exports.forgetPassword = catchAsync(async(req,res,next)=>{

    const {email} = req.body

    if(!email)
        return next(new AppError(
        'you should provide an e-mail',
        400))

    const user = await User.findOne({email})

    if(!user)
        return next(new AppError(
        'Please enter a valid e-mail'
         ,400))

    const resetToken = user.genrateResetToken()

    try {
        await user.save({ validateBeforeSave: false });
    } catch (err) {
        return next(new AppError(
            'Failed to save the reset token. Please try again later.'
            , 500));
    }
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetToken}`

    const message = ` 
                        <html>
                            <head>
                               <style>
                             body {
                                        font-family: Arial, sans-serif;
                                        line-height: 1.6;
                                        padding: 20px;
                                    }
                                    h2 {
                                        color: #333;
                                    }
                                    p {
                                        color: #555;
                                    }
                                    .reset-link {
                                        display: inline-block;
                                        padding: 10px 15px;
                                        background-color: #007BFF;
                                        color: white;
                                        text-decoration: none;
                                        border-radius: 5px;
                                        margin-top: 10px;
                                    }
                                </style>
                            </head>
                                <body>
                                        <h2>Forgot your Password?</h2>
                                        <p>Submit a Patch request with your new password and <strong>passwordConfirm</strong> to <a href="${resetUrl}" class="reset-link">${resetUrl}</a>.</p>
                                        <p>If you didn't forget your password, please ignore this email. Don't worry, maybe someone typed your email by mistake.</p>
                                </body>
                        </html>
`;

     
    try {
        
        await sendEmail({
            to:user.email,
            subject:' your password reset token (valid in 10min)',
            message
        })

        res.status(200).json({
            status:"success",
            message:"send email successfully"
        })

        
    } catch (error) {

        user.passwordResetToken = undefined,
        user.passwordResetTokenExpire =undefined
        await user.save({ validateBeforeSave: false });
        
        return next (new AppError(
            `There was an error sending the email. Try again later! ,message:${error.message}`
            ,500))
         }
    
})


exports.resetpassword = catchAsync(async(req,res,next)=>{

    const resetToken = req.params.token

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetTokenExpire:{$gt : Date.now()}
    }).select('+password')

    if(!user)
        return next(new AppError(
        'this token is not valid or expired'
        ,400))

    const {newPassword ,passwordconfirm} = req.body
    
    if(await user.comparePassword(newPassword,user.password))
        return next(new AppError(
            `you cann't set your current password as your new password`
            ,400))


    user.password=newPassword
    user.passwordconfirm=passwordconfirm
    user.passwordChangedAt= Date.now()

    user.passwordResetToken=undefined
    user.passwordResetTokenExpire=undefined

    await user.save()

    res.status(200).json({
        status:"success",
    })
})

