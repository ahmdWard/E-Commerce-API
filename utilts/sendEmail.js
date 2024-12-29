const nodemailer = require ('nodemailer')


const sendEmail = async options =>{
    const transport = nodemailer.createTransport({
        host:process.env.HOSTNAME,
        port:process.env.SERVICEPORT,
        secure:false,
        auth:{
            user:process.env.EMAILUESERNAME,
            pass:process.env.EMAILPASSWORD
        }
    })

    const email={
        from:process.env.FROM,
        to:options.to,
        subject:options.subject,
        html:options.message
     }
     await  transport.sendMail(email)

}

module.exports = sendEmail




 