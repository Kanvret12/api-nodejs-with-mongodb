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
      var url = `http://localhost:80/users/verifyemail?token=` + token;
  
    await smtpTransport.sendMail({
      from: process.env.USER,
      to: email,
      subject: "SAHKAN EMAIL ANDA",
      html: `
      <!DOCTYPE html>
      <html>
        <button href=${url}> CLICK TO VERIFI </button>
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