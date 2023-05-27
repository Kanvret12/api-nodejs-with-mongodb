const mongoose = require('mongoose');

const Token = mongoose.Schema({
    email: { type: String },
    username: { type: String },
    password: { type: String},
    token: { type: String},
});
module.exports.Token = mongoose.model('NotVeri', Token);