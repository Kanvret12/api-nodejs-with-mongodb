const {smtp, email} =require('../config');
const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: email,
    pass: smtp,
  }
});

module.exports.sendVerifyEmail = async (email, token) => {
    return new Promise(async(resolve, rejecet) => {
      var url = `http://54.147.200.35/users/verifyemail?token=` + token;
  
    await smtpTransport.sendMail({
      from: process.env.USER,
      to: email,
      subject: "SAHKAN EMAIL ANDA",
      html: `
      <!DOCTYPE html>
      <html>
      <center>
        <a href=${url}> CLICK TO VERIFI </a>
      </center>
      </html>
  
    `,
  }, (error, info) => {
    if (error) {
      resolve('error')
      console.log(`[!] Warning SMTP error ,Limit Habis`);
    } else{
      resolve()
    }
  });
  
  })
  
  }
