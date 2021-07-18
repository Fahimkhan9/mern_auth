
require('dotenv').config({path:'./config.env'})
const express = require('express')
// const cors = require('cors')
const userRoutes=require('./routes/auth')
const privateRoutes=require('./routes/private')
const connectDB= require("./config/db")
const errorHandler = require('./middleware/error')


connectDB()

const app = express()



app.use(express.json())
// app.use(cors())
app.use('/api/auth',userRoutes)
app.use('/api/private',privateRoutes)


// should be tha last middleware
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT,() => {
    console.log('running')
})


process.on('unhandledRejection',(err,promise) => {
    console.log(`logged error:${err}`)
    server.close(() => process.emit(1) )
})