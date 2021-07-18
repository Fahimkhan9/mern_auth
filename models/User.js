const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please provide  username']
    },
    email:{
        type:String,
        required:[true,'Please provide  email'],
        unique:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    password:{
        type:String,
        required:[true,'Please provide  password'],
        minLength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpireDate:String
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.metchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.getSignedToken = function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
})
}


userSchema.methods.getResetpasswordToken = function(){
  const resetToken =crypto.randomBytes(20).toString('hex');


  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpireDate=Date.now() + 10 * (60 * 1000); 
return resetToken

    }
    


const User = mongoose.model('User',userSchema)

module.exports = User