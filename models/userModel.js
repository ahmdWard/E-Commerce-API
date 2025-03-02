const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


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
        unique:[true,"phone must be unique"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[10,"password is too short"],
        select:false

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
        enum:[ 'user','admin','manager','vendor' ],
        default:'user'
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpire:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    isBlocked:{
        type:Boolean,
        default:false,

    },
    address:
        {
            country:{
                type:String,
                required:true
            },
            state:{
                type:String,
                required:true
            },
            street:{
                type:String,
                required:true
            },
            building:{
                type:Number,
                required:true
            },
            flatNumber:{
                type:Number,
                required:true
            }
        }
    ,
},{timeStamp:true})

userSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password,12)
    this.passwordconfirm = undefined
    next()
})

userSchema.pre(/^find/,function(next){

    this.find({active : {$ne:false}})
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword,userPassword){

  return await bcrypt.compare(candidatePassword,userPassword)
    
}

userSchema.methods.generateResetToken= function(){
    
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000

    return resetToken

}

userSchema.methods.updatePassword = async function (newPassword) {
    if (await this.comparePassword(newPassword, this.password)) {
        throw new Error("New password must be different from the old password");
    }
   
};
module.exports=mongoose.model('User',userSchema)