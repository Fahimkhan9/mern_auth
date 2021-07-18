
const jwt=require('jsonwebtoken')
const ErrorResponse=require('../utils/errorResponse')
const User=require('../models/User')
exports.protect= async  (req,res,next) => {
    let token;
    console.log(req.headers.authorization)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token =req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new ErrorResponse('UnAUthorized',401) )
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        const user=await User.findById(decoded.id)

        if(!user){
            return next(new ErrorResponse('no user found  with this id',404))
        }
        req.user=user

        next()
        
    } catch (error) {
        console.log(error)
        return next(new ErrorResponse('UnAuthorized',401) )
    }

}