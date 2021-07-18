const nodemailer=require('nodemailer')


const sendEmail = (options) => {
const transporter= nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }   
})


const mailOptions = {
    from:process.env.EMAIL_FROM,
    to:options.to,
    subject:options.subject,
    html:options.text
}

transporter.sendMail(mailOptions,function(err,info){
    if(err){
        console.log(err)
    }else{
        console.log(info)
    }
})


}

module.exports= sendEmail


// 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