const express = require('express');
const router = express.Router();
const { cekKey } = require('../database/db');
const scrape = require('../lib/scrape');
const axios = require('axios');
const message = { status: true, creator: 'SHIELD', Url: '[URL] Masukan Parameter Url', Text: '[TEXT] Masukan Parameter Text' };
const {Visitor} = require('../database/model');

async function apiFunc(req, res) {
  return new Promise(async (resolve, reject) => {
    var apikey = req.query.apikey;
    var user = await cekKey(apikey);
    if (apikey === undefined) {
      return res.status(202).send({ status: 202, message: `Masukkan Parameter apikey` });
    } else if (!user) {
      return res.status(203).send({ status: 203, message: ' Apikey tidak valid' });
    } else {
      resolve(true);
    }
  });
}

//==    CHAT GPT    ==\\

router.all('/openai', async (req, res) => {
  await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1} });
  let text = req.query.text;
  await apiFunc(req, res);
  scrape
    .openai(text)
    .then(async (result) => {
      res.json({ status: true, creator: 'SHIELD', result: result });
    })
    .catch((err) => {
      res.json(err.message);
    });
});

//==    WIBU    ==\\
router.all('/randomanime', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    await apiFunc(req, res);
    const json = (await axios.get(`https://raw.githubusercontent.com/Kanvret12/loli/main/anime.json`)).data;
    const random = json[Math.floor(Math.random() * json.length)];
    const bf = (await axios.get(random, { responseType: 'arraybuffer' })).data;
    res.type('png').send(bf);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.all('/updateanime', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    await apiFunc(req, res);
    const arr = await scrape.updateanime();
    // Insert the request into MongoDB
    res.json({ status: true, creator: 'SHIELD', result: arr });
  } catch (err) {
    res.json(err.message);
  }
});

router.all('/loli', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    await Visitor.create({ endpoint: '/loli', timestamp: Date.now(), apiKey: req.query.apikey });
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
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
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

router.all('/tiktokdl', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    let url = req.query.url;
    await apiFunc(req, res);
    if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
    const data = await scrape.musical(url);
    // Insert the request into MongoDB
    res.json({ status: message.status, creator: message.creator, result: data });
  } catch (err) {
    res.json(err.message);
  }
});

router.all('/twitter', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1,reqday: 1 } });
    let url = req.query.url;
    await apiFunc(req, res);
    if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
    const arr = await scrape.twitter(url);
    // Insert the request into MongoDB
    res.json({ status: message.status, creator: message.creator, result: arr });
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
