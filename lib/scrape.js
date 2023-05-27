const { keyAi } = require('../config');
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require("qs");

function updateanime() {
    return new Promise(async(resolve, reject) => {
        const BASE_URL = 'https://samehadaku.cam/';
	    let html = (await axios.get(BASE_URL)).data
	    let $ = cheerio.load(html), arr = []
	    $('div.post-show > ul > li').each((idx, el) => {
		arr.push({
			title: $(el).find('a').attr('title'),
			cover: $(el).find('img').attr('src'),
			rilis: $(el).find('div.dtla > span').text()
		})
        resolve(arr);
	})


    })
}
function openai(text) { 
    return new Promise(async(resolve, reject) => { 
	    let openai = await axios.post('https://api.openai.com/v1/chat/completions', {
		model: 'gpt-3.5-turbo',
		messages: [{
			role: 'user',
			content: text
		}]
	}, {headers: {authorization:keyAi }})
    const result = openai.data.choices[0].message.content
    resolve(result)
    })
}
function randomanime() {
    return new Promise(async(resolve, reject) => {
        const BASE_URL = `https://www.pxfuel.com/en/query?q=anime`;
	    let html = (await axios.get(BASE_URL)).data
	    let $ = cheerio.load(html), arr = []
	    $('ul > li > figure').each((idx, el) => {
		arr.push($(el).find('a > img').attr('data-src'))
	})
    resolve(arr)
    })
}
function loli() {
	return new Promise(async (resolve, reject) => {
	  try {
		const startPage = 2; // Set the starting page
		const endPage = 68; // Set the ending page
		const urls = [];
		for (let page = startPage; page <= endPage; page++) {
		  const url = `https://safebooru.org/index.php?page=post&s=list&tags=loli&pid=${40 + (page - 2) * 40}`;
		  urls.push(url);
		}
		const arr = [];
		for (const url of urls) {
		  let html = (await axios.get(url)).data;
		  let $ = cheerio.load(html);
		  $('div.content > div > span').each((idx, el) => {
			arr.push(
			  $(el).find('a > img').attr('src').replace('/thumbnails/', '/images/').replace('thumbnail_', '').replace(/\?.*$/, ''));
		  });
		}
		resolve(arr);
	  } catch (error) {
		reject(error);
	  }
	});
  }
function twitter(url){
	return new Promise((resolve, reject) => {
		let config = {
			'URL': url
		}
		axios.post('https://twdown.net/download.php',qs.stringify(config),{
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
			}
		})
		.then(({ data }) => {
			let $ = cheerio.load(data), arr = []
			arr.push({
			desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
			thumb: $('div:nth-child(1) > img').attr('src'),
			HD: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
			SD: $('tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
			audio: 'https://twdown.net/' + $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a').attr('href')})
			return resolve(arr)
		})
	})
}
function musical(URL) {
	return new Promise((resolve, rejecet) => {
        axios.get('https://musicaldown.com/id', {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            }
        }).then(res => {
            const $ = cheerio.load(res.data)
            const url_name = $("#link_url").attr("name")
            const token_name = $("#submit-form > div").find("div:nth-child(1) > input[type=hidden]:nth-child(2)").attr("name")
            const token_ = $("#submit-form > div").find("div:nth-child(1) > input[type=hidden]:nth-child(2)").attr("value")
            const verify = $("#submit-form > div").find("div:nth-child(1) > input[type=hidden]:nth-child(3)").attr("value")
            let data = {
                [`${url_name}`]: URL,
                [`${token_name}`]: token_,
                verify: verify
            }
        axios.request({
            url: 'https://musicaldown.com/id/download',
            method: 'post',
            data: new URLSearchParams(Object.entries(data)),
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                'cookie': res.headers["set-cookie"]
            }
        }).then(respon => {
            const ch = cheerio.load(respon.data)
		if(!ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(3)').attr('href')){
			let hasil = []
            ch('body > div.welcome.section > div > div:nth-child(2) > div > div.row > div').each(function (a, b) {
                hasil.push({
                    url: ch(b).find('img').attr('src'),
					url_download: ch(b).find('a').attr('href')
                })
            })
			
			let result = {
				audio: ch('body > div.welcome.section > div > div:nth-child(2) > div > a:nth-child(7)').attr('href'),
				audio_download: ch('#download').attr('href'),
				photo: hasil
			}
			if (!result.photo[0]){
			resolve()
			}else{
			resolve(result)	
			}
			
		}else{
        axios.request({
            url: 'https://musicaldown.com/id/mp3',
            method: 'post',
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                'cookie': res.headers["set-cookie"]
            }
        }).then(resaudio => { 
            const hc = cheerio.load(resaudio.data)       
            const result = {
				pp: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l4.center-align > div > div > img').attr('src'),
				username: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l4.center-align > div > h2:nth-child(2) > b').text(),
				description: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l4.center-align > div > h2:nth-child(3)').text(),
				video: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(3)').attr('href'),
				video2: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(5)').attr('href'),
                video_HD: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(7)').attr('href'),
				video_watermark: ch('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(9)').attr('href'),
				audio: hc('body > div.welcome.section > div > div:nth-child(2) > div.col.s12.l8 > a:nth-child(6)').attr('href'), 
				audio_Download: hc('#download').attr('href')
            }
        resolve(result)
		})
	  }
   })
})
})
}

module.exports = {openai, randomanime, updateanime, loli, musical, twitter}