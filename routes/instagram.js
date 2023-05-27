let express = require("express");
let sh = express.Router();
let { igApi, getCookie } = require("insta-fetcher");
let { sessions_ig } = require('../config');
let ig = new igApi(sessions_ig);

sh.all('/igdl', async (req, res) => {
	if (!req.query.url) throw res.json({status: 200, message: "url parameter cannot be empty"})
	ig.fetchPost(req.query.url)
	.then((v) => {
    res.status(200)
	.json(v);
	});
});

module.exports = sh;