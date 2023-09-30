const express = require('express');
const router = express.Router();
const { cekKey } = require('../database/db');
const scrape = require('../lib/scrape');
const axios = require('axios');
const message = { status: true, creator: 'SHIELD', Url: '[URL] Masukan Parameter Url', Text: '[TEXT] Masukan Parameter Text' };
const {Visitor} = require('../database/model');
const textpro = require("../lib/data/textpro");
const photooxy = require("../lib/data/photooxy.js");
const { spawn } = require('child_process');

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

// router.all('/openai', async (req, res) => {
//   await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1} });
//   let text = req.query.text;
//   await apiFunc(req, res);
//   scrape
//     .openai(text)
//     .then(async (result) => {
//       res.json({ status: true, creator: 'SHIELD', result: result });
//     })
//     .catch((err) => {
//       res.json(err.message);
//     });
// });
router.all('/openai', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1}});
    let text = req.query.text;
    await apiFunc(req, res);
    if (!text) return res.json({ status: message.status, creator: message.creator, message: message.Text });
    const json = (await axios.get(`https://aemt.me/openai?text=${text}`)).data;
    res.json({ status: message.status, creator: message.creator, result: json.result });
  } catch(err) {
    res.send(err.toString());
  }
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
  } catch (e) {
    res.json(e.toString());
  }
});

router.all('/waifu', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    await apiFunc(req, res);
    const json = (await axios.get(`https://api.waifu.pics/sfw/waifu`)).data;
    const bf = (await axios.get(json.url, { responseType: 'arraybuffer' })).data;
    res.type('png').send(bf);
  } catch (error) {
    res.send(error.toString());
  }
});
router.all('/neko', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    await apiFunc(req, res);
    const json = (await axios.get(`https://api.waifu.pics/sfw/neko`)).data;
    const bf = (await axios.get(json.url, { responseType: 'arraybuffer' })).data;
    res.type('png').send(bf);
  } catch (error) {
    res.send(error.toString());
  }
});
router.all('/megumin', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    await apiFunc(req, res);
    const json = (await axios.get(`https://api.waifu.pics/sfw/megumin`)).data;
    const bf = (await axios.get(json.url, { responseType: 'arraybuffer' })).data;
    res.type('png').send(bf);
  } catch (error) {
    res.send(error.toString());
  }
});



//==    DOWNLOADER    ==\\

// router.all('/tiktokdl', async (req, res) => {
//   try {
//     await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
//     let url = req.query.url;
//     await apiFunc(req, res);
//     if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
//     const data = await scrape.musical(url);
//     res.json({ status: message.status, creator: message.creator, result: data });
//   } catch (e) {
//     res.json(e.toString());
//   }
// });

router.all('/twitter', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1,reqday: 1 } });
    let url = req.query.url;
    await apiFunc(req, res);
    if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
    const arr = await scrape.twitter(url);
    res.json({ status: message.status, creator: message.creator, result: arr });
  } catch (e) {
    res.json(e.toString());
  }
});
router.all('/facebook', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1,reqday: 1 } });
    let url = req.query.url;
    await apiFunc(req, res);
    if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
    const arr = await scrape.facebook(url);
    res.json({ status: message.status, creator: message.creator, result: arr });
  } catch (e) {
    res.json(e.toString());
  }
});
router.all('/tiktokdl', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1,reqday: 1 } });
    let url = req.query.url;
    await apiFunc(req, res);
    if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
    const arr = await scrape.tiktokdl(url);
    res.json({ status: message.status, creator: message.creator, result: arr });
  } catch (e) {
    res.json(e.toString());
  }
});

router.all('/multidl', async(req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1}});
    let url = req.query.url;
    await apiFunc(req, res);
    if (!url) return res.json({ status: message.status, creator: message.creator, message: message.Url });
    const arr = await scrape.multidl(url)
    res.json({ status: message.status, creator: message.creator, result: arr });
  } catch(e) {
    res.send(e.toString());
  }
});

//==    WEBS    ==\\

router.all('/komiksearch', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    let text = req.query.text;
    let apikey = req.query.apikey
    await apiFunc(req, res);
    const arr = await scrape.komikusearch(text, apikey);
    res.json({ status: true, creator: 'SHIELD', result: arr });
  } catch (e) {
    res.json(e.toString());
  }
});
router.all('/komikdetail', async (req, res) => {
  try {
    await Visitor.updateOne({}, { $inc: { count: 1, reqday: 1 } });
    let url = req.query.url;
    await apiFunc(req, res);
    const arr = await scrape.komikdetail(url);
    res.json({ status: true, creator: 'SHIELD', result: arr });
  } catch (e) {
    res.json(e.toString());
  }
});

//==    TEXT PRO    ==\\
router.all('/textpro/pencil', async (req, res, next) => {
	  let text = req.query.text;
    await apiFunc(req, res);
    if (!text) return res.json({ status: message.status, creator: message.creator, message: message.Text });
	textpro("https://textpro.me/create-a-sketch-text-effect-online-1044.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((e) =>{
  res.json(e.toString());
})
})

//==  PHOTOOXY   ==\\
router.get('/photooxy/naruto', async (req, res, next) => {
	let text = req.query.text;
  await apiFunc(req, res);
  if (!text) return res.json({ status: message.status, creator: message.creator, message: message.Text });
	photooxy("https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html", [text])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((e) =>{
  res.json(e.toString());
})
})


router.get('/photooxy/pubg', async (req, res, next) => {
  let text = req.query.text;
  if (!text) return res.json({ status: message.status, creator: message.creator, message: message.Text });  
	var text2 = req.query.text2
  await apiFunc(req, res);
	if (!text2 ) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter text2"})  
	photooxy("https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html", [text,text2])
.then((data) =>{ 
	res.set({'Content-Type': 'image/png'})
	res.send(data)
	})
.catch((e) =>{
  res.json(e.toString());
})
})
module.exports = router;
