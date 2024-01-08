const {smtp, email, urlD} =require('../config');
const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
  auth: {
    user: email1,
    pass: smtp,
  }
});

module.exports.sendVerifyEmail = async (email, token) => {
    return new Promise(async(resolve, rejecet) => {
      var url = `${urlD}/users/verifyemail?token=` + token;
  
    await smtpTransport.sendMail({
      from: email1,
      to: email,
      subject: "VERIFIKASI EMAIL ANDA",
      html: `
      <html>
      <head>
        <style>
        *{
          margin:0;
          padding:0;
        }
        html {
          background-color: black;
        }
        span {
          color: white;
        }
        .page {
          border-bottom: 2px solid rgb(100, 99, 99);
        }
        .text {
          margin-top: 10px;
        }
        p {
          color: white;
          font-weight: 700;
          font-size: 40px;
        }
        a {
          font-family: "Helvetica";
          font-weight: 700;
          color: whitesmoke;
          text-align: center;
          display: block;
          text-decoration: none;
        }
        
        .block {
          background:black;
          position: relative;
          width: 300px;
        
          padding: 1rem;
          margin: 10% auto;
          border-radius: 30px;
          border: 1px solid whitesmoke;
        }
        
        .glow::before, glow::after {
          content:'';
          position:absolute;
          left: -5px;
          top: -5px;
          background: linear-gradient(45deg, #993333, #ff00ff, #6e0dd0, #099fff, #ff00 ,#993333);
          background-size: 400%;
          width: calc(100% + 10px);
          height: calc(100% + 10px);
          z-index: -1;
          animation: animate 20s linear infinite;
          
          
        }
        
        @keyframes animate {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 400% 0;
          }
          100% {
            background-position: 0 0;
          }
        }
        
        .glow::before {
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        
        .glow:hover::before {
          opacity: 100;
        }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="shield">
            <div class="page">
              <p>SHIELD</p>
            </div>
            <div class="text">
              <span>Verifikasi akun Anda, klik di bawah ini:</span>
            </div>
          </div>
          <div class="button">
            <a href="${url}" class="block glow">Click Here</a>
          </div>
        </div>
      </body>
      </html> `,
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
