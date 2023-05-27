let express = require("express");
let sh = express.Router();
let { igApi, getCookie } = require("insta-fetcher");
let { sessions_ig } = require('../config');
let ig = new igApi(sessions_ig);
const { cekKey } = require('../database/db');

async function apiFunc(req,res){
    return new Promise(async(resolve, reject) => {
        var apikey = req.query.apikey;
        var user = await cekKey(apikey);
        if (apikey === undefined) { 
            return res.status(202).send({ status: 202, message: `Masukkan Parameter apikey` })
        } else if (!user) { 
            return res.status(203).send({ status: 203, message: ' Apikey tidak valid' })
        } else { resolve(true); }
    })
}
sh.all('/igdl', async (req, res) => {
	if (!req.query.url) throw res.json({status: 200, message: "url parameter cannot be empty"})
	await apiFunc(req, res);
	ig.fetchPost(req.query.url)
	.then((v) => {
		res.status(200).json(v);
	})
	.catch((e) => {
		res.send({ status: 400, result: e.toString() })
		});
});
sh.all('/igstalk', async (req, res) => {
	if (!req.query.user) throw res.json({status: 200, message: "user parameter cannot be empty"})
	await apiFunc(req, res);
	ig.fetchUser(req.query.user)
	.then((v) => {
		res.status(200).json(v);
	})
	.catch((e) => {
		res.send({ status: 400, result: e.toString() })
		});
});

module.exports = sh;