const User = require("../models/User")
const sendEmail = require('../utils/sendEmail')
const ErrorResponse =require("../utils/errorResponse")
const crypto = require('crypto')

exports.register = async (req,res,next) => {
    const {username,email,password} = req.body
    try {
        const user= await User.create({
            username,
            email,
            password
        })

        sendToken(user,201,res)
        
    } catch (error) {
        console.log(error)
        // res.status(500).json({
        //     success:false,
        //     error:error.message
        // })
        next(error)
    }
 
}

exports.login = async (req,res,next) => {
    const {email,password} = req.body
    if(!email || !password){
        // res.status(400).json({
        //     success:false,
        //     error:"please provide email and password"
        // })
        return next(new ErrorResponse('please provide email and password',400))
    }


    try {
        const user = await User.findOne({email}).select('+password')
        if(!user){
            // res.status(404).json({
            //     success:false,
            //     error:'Invalid credentials'
            // })
        
            return next(new ErrorResponse('Invalid credentials',401))
        
        }


        const isMatch = await user.metchPassword(password)
        if(!isMatch){
            // res.status(404).json({
            //     success:false,
            //     error:'Invalid credentials'
            // })
            return next(new ErrorResponse('Invalid credentials',401))

        }
        
        // res.status(201).json({
        //     success:true,
        //     token:'sfsd'
        // })
        sendToken(user,201,res)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            error:error.message
        })
    }


    res.send('login ')
}
exports.forgotpassword = async (req,res,next) => {
    const{email} =req.body
    try {
        const user= await User.findOne({email})
        if(!user){
            return next(new ErrorResponse("email could not be sent",404) )
        }

        const resetToken =user.getResetpasswordToken()

        await user.save()

        const resetUrl = `http://localhost:3000/passwodreset/${resetToken}`

        const message =`
        <h1>Password reset link</h1>

        <p>A password reset was send to this email.Please visit this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off >${resetUrl}</a>
        `
        try {
            await sendEmail({
                to:user.email,
                subject:'Password Reset Request',
                text:message
            })
            res.status(200).json({
                success:true,
                data:"Email sent"
            })
        } catch (error) {
            console.log(error)
            user.resetPasswordToken=undefined
            user.resetPasswordExpireDate=undefined
            await user.save()

            return next(new ErrorResponse('Email could not be send',500)  )
        }
        
    } catch (error) {
        console.log(error)
        next(error)
    }

}

exports.resetpasswrod = async (req,res,next) => {
    const resetPasswordToken =crypto.createHash('sha256').update(req.params.resetoken).digest('hex')
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpireDate: {$gt: Date.now() }
        })
        if(!user){
            return next(new ErrorResponse('Invalid reset token',400)  )
        }
        user.password=req.body.password
        user.resetPasswordToken=undefined
        user.resetPasswordExpireDate=undefined

        await user.save()

        res.status(201).json({
            success:true,
            data:'Password Reset Success'
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}


const sendToken = (user,statusCode,res) =>{
    const token = user.getSignedToken()
    res.status(statusCode).json({token,suceess:true})
}