const express = require('express');
const router = express.Router();
const { cekKey } = require('../database/db');
const scrape = require('../lib/scrape');
const axios = require('axios');
const message = {status: true, creator: 'SHIELD', Url:  '[URL] Masukan Parameter Url', Text: '[TEXT] Masukan Parameter Text'};


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

//==    CHAT GPT    ==\\

router.all('/openai', async(req,res) => {
    let text = req.query.text  
    await apiFunc(req, res);
    scrape.openai(text).then(async (result) => {
    res.json({status: true, creator: 'SHIELD', result: result })
    }).catch((err) => {res.json(err.message)});
})

//==    WIBU    ==\\

router.all('/randomanime', async(req, res) => { 
    await apiFunc(req,res);
    scrape.randomanime().then(async(arr) => {
    random = arr[Math.floor(Math.random() * arr.length)]
    bf = (await axios.get(random, { responseType: 'arraybuffer' })).data
    res.type('png').send(bf)
    }).catch((err) => {res.json(err.message)});
})
router.all('/updateanime', async(req, res) => { 
    await apiFunc(req,res);
    scrape.updateanime().then(async(arr) => {
    res.json({status: true, creator: 'SHIELD', result: arr})
    }).catch((err) => {res.json(err.message)});
})
router.all('/loli', async (req, res) => {
    try {
      await apiFunc(req, res);
      const json = (await axios.get(`https://raw.githubusercontent.com/Kanvret12/loli/main/loli.json`)).data;
      const random = json[Math.floor(Math.random() * json.length)];
      const bf = (await axios.get(random, { responseType: 'arraybuffer' })).data;
      res.type('png').send(bf);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
router.all('/waifu', async (req, res) => {
    try {
      await apiFunc(req, res);
      const json = (await axios.get(`https://raw.githubusercontent.com/Kanvret12/loli/main/waifu.json`)).data;
      const random = json[Math.floor(Math.random() * json.length)];
      const bf = (await axios.get(random, { responseType: 'arraybuffer' })).data;
      res.type('png').send(bf);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
//==    DOWNLOADER    ==\\

router.all('/tiktokdl', async(req,res) => {
    let url = req.query.url
    if (!url ) return res.json({status: message.status, creator: message.creator, message: message.Url})  
    scrape.musical(url).then(data => {
    res.json({status: message.status, creator: message.creator, result: data })
    }).catch((err) => {res.json(err.message)});
})
router.all('/twitter', async(req, res) => {
    let url = req.query.url
    if (!url ) return res.json({status: message.status, creator: message.creator, message: message.Url})  
    scrape.twitter(url).then(arr => {
    res.json({status: message.status, creator: message.creator, result: arr })
    }).catch((err) => {res.json(err.message)});
})

module.exports = router;
