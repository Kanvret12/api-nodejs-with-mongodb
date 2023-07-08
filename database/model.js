const mongoose = require('mongoose');

const Users = mongoose.Schema({
    email: { type: String },
    username: { type: String },
    password: { type: String},
    apikey: { type: String },
    defaultKey: { type: String },
    premium: { type: Array },
    limit: { type: Number }
}, { versionKey: false });
module.exports.User = mongoose.model('user', Users);

const Token = mongoose.Schema({
    email: { type: String },
    username: { type: String },
    password: { type: String},
    token: { type: String},
});
module.exports.Token = mongoose.model('NotVeri', Token);

const Visitor = mongoose.Schema({
    count: { type: Number, default: 0 },
    reqday: { type: Number, default: 0 },
});
module.exports.Visitor = mongoose.model('visitor', Visitor);
