let express = require("express");
let sh = express.Router();
let { igApi, getCookie } = require("insta-fetcher");
let { sessions_ig } = require('../config');
let ig = new igApi(sessions_ig);

sh.all('/igdl', async (req, res) => {
	if (!req.query.url) throw res.json({status: 200, message: "url parameter cannot be empty"})
	ig.fetchPost(req.query.url)
	.then((v) => {
		res.status(200).json(v);
	});
	.catch((e) => {
		res.send({ status: 400, result: e.toString() })
		});
});
sh.all('/igstalk', async (req, res) => {
	if (!req.query.user) throw res.json({status: 200, message: "user parameter cannot be empty"})
	ig.fetchUser(req.query.url)
	.then((v) => {
		res.status(200).json(v);
	});
	.catch((e) => {
		res.send({ status: 400, result: e.toString() })
		});
});
sh.all('/stories', async (req, res) => {
	if (!req.query.user) throw res.json({status: 200, message: "user parameter cannot be empty"})
	ig.fetchStories(req.query.url)
	.then((v) => {
		res.status(200).json(v);
	});
	.catch((e) => {
		res.send({ status: 400, result: e.toString() })
		});
});

module.exports = sh;