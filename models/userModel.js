const mongoose = require('mongoose')
const validator = require('validator')
const { default: isEmail } = require('validator/lib/isEmail')
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'First name is required']
    },
    lastname:{
        type:String,
        required:[true,'Last name is required']
    },
    email:{
        type:String,
        required:[true,'E-mail is required'],
        unique:[true,"email must be unique"],
        validate:[validator.isEmail,'invalid E-mail']
    },
    phone:{
        type:String,
        required:[true,'phone number is required'],
        unique:[true,"email must be unique"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[10,"password is too short"]

    },
    passwordconfirm:{
        type:String,
        required:[true,'password confirmation is required'],
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:'passwors are not the same'
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }

})

module.exports=mongoose.model('user',userSchema)