const User = require('../models/userModel')

exports.getAllUsers  = async (req,res,next)=>{

    const users = await User.find()

    res.status(200).json({
        status:"success",
        length:users.length,
        data:{
            users
        }
    })
}

exports.createUser = async (req,res,next)=>{
    
    const user = await User.create(req.body)

    res.status(201).json({
        status:"success",
        data:{
             user
        }
    })
}