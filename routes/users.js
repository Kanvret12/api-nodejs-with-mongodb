const express = require('express');
const router = express.Router();
const passport = require('passport');
const {Token} = require('../database/model');
const sendEmail = require("../mailer/config");
const crypto = require("crypto");

const { getHashedPassword, randomText } = require('../lib/function');
const { checkEmail, addUser, NotVer } = require('../database/db');
const { notAuthenticated } = require('../lib/auth');

router.get('/', notAuthenticated, (req, res) => {
    res.render('login', {
        layout: 'layouts/main'
    });
});

router.get('/login', notAuthenticated, (req, res) => {
    res.render('login', {
        layout: false
    });
});

router.post('/login', async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

router.get('/register', notAuthenticated, (req, res) => {
    res.render('register', {
        layout: false
    });
});

router.post('/register',  async (req, res) => {
    try {
        let {email, username, password, confirmPassword } = req.body;
        if (password.length < 6 || confirmPassword < 6) {
            req.flash('error_msg', 'Password must be at least 6 characters');
            return res.redirect('/users/register');
        }
        if (password === confirmPassword) {
            let checking = await checkEmail(email);
            if(checking) {
                req.flash('error_msg', 'A user with the same email already exists');
                return res.redirect('/users/register');
            } else {
                let hashedPassword = getHashedPassword(password);
                let tokenv = crypto.randomBytes(32).toString("hex") 
                NotVer(email, username, hashedPassword, tokenv);
                const Users = new Token({ email });
                await sendEmail.sendVerifyEmail(Users.email, tokenv);
                req.flash('success_msg', 'Check Your Email and Verif Your Email, See You :) ');
                return res.redirect('/users/login');
            }
        } else {
            req.flash('error_msg', 'Password does not match.');
            return res.redirect('/users/register');
        }
    } catch(err) {
        console.log(err);
    }
})
router.get('/verifyemail', async (req, res) => {
    const token = req.query.token;
    if (token) {
        var check = await Token.findOne({ token: token });
        if (check) {
            let apikey = randomText(16);
            addUser(check.email, check.username, check.password, apikey)
            await Token.findOneAndDelete({ token: token });
            req.flash('success_msg', ' email has been verified ');
            res.redirect('/users/login');
        } else {
            if (req.User) {
            res.redirect("login");
        }else{
            req.flash('error_messages', 'Link Expired Or Error')
            res.redirect('/users/login');
        }
    }
    } else {
        if (req.User) {
            res.redirect("/");
        }else{
            req.flash('error_messages', 'Token Missing')
            res.redirect('/users/login');
        }
    }
  })

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'logout success');
    res.redirect('/users/login');
});

module.exports = router;
