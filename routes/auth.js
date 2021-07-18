const express =require('express')
const { register, login, forgotpassword, resetpasswrod } = require('../controllers/auth')

const router= express.Router()



router.post('/register',register)
router.post('/login',login)
router.put('/resetpassword/:resetoken',resetpasswrod)
router.post('/forgotpassword',forgotpassword)



module.exports=router