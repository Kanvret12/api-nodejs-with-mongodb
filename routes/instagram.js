let express = require("express");
let sh = express.Router();
let { igApi, getCookie } = require("insta-fetcher");
let { sessions_ig } = require('../config');
let ig = new igApi("your cookie");

module.exports = sh;