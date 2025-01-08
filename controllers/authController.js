
const jwt = require('jsonwebtoken')
const crypto = require ('crypto')
const { promisify } = require('util');
const User = require('../models/userModel')
const AppError = require('../utilts/appError')
const catchAsync = require('../middleware/catchAsync');
const sendEmail = require('../utilts/sendEmail')


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRATION, 
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRATION, 
    });

    return { accessToken, refreshToken };
};



exports.protect = catchAsync(async(req,res,next)=>{

    let token

    if(req.headers.authorization && !req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
   
    if(!token)
        return next(new AppError(
    'login first to get the access'
    ,401)) 

    const decoded = await promisify (jwt.verify)(token,process.env.ACCESS_SECRET)

    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(new AppError(
            'The user belonging to this token does no longer exist.'
            , 401));
    }

    req.user = currentUser
    next()
})


exports.refreshToken = catchAsync(async(req,res,next)=>{

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken)
        return next(new AppError(
    'Refresh token is required',400
    ))

    const decoded = await promisify(jwt.verify)(refreshToken,process.env.REFRESH_SECRET)

    const currentUser = await User.findById(decoded.id)
    
    if(!currentUser){
         
        return next(new AppError(
            'The user belonging to this token does no longer exist.',
            401
        ))
    }

    const { accessToken } = generateTokens(currentUser.id);

    res.cookie('jwt',accessToken,{
        expires: new Date(Date.now()+process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true
    })

    res.status(200).json({
        status: 'success',
        accessToken,
    });

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


exports.login = catchAsync(async(req,res,next)=>{
   
    const {email , password} = req.body

    if (!email || !password) {
        return next(new AppError(
            'Please provide email and password'
            , 400));
    }

    const user = await User.findOne({ email }).select("+password")
    if(!user||! await user.comparePassword(password,user.password))
       return next(new AppError(
    'Email or password is not correct'
    ,403))


    const { accessToken, refreshToken } = generateTokens(user.id);



    await user.save({validateBeforeSave:false})

    res.cookie('jwt',accessToken,{
        expires:new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly:true
    })
    
    res.cookie('refreshToken',refreshToken,{
        expires:new Date(Date.now() + process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 60 * 60 * 1000),
        httpOnly:true
    })
    

    res.status(200).json({
        status:"success",
        message: 'Logged in successfully',
        accessToken,
        refreshToken
    })

})



exports.logOut = catchAsync(async(req,res,next)=>{

    const user = await User.findById(req.user.id)
    res.cookie('refreshToken','loggedOut',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.cookie('jwt','loggedOut',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        status:"success",
        message:"Logged out successfully"
    })

})




exports.restrictTo = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role))
            return next(new AppError(
        `You do not have permission to perform this action`,
        403 
        ))
        next()
    }
}


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


exports.resetPassword = catchAsync(async(req,res,next)=>{

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

