const { keyAi } = require('../config');
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require("qs");
const {getApikey} = require('../database/db');
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
  function komikusearch(text) {
    return new Promise(async(resolve, reject) => {
        const BASE_URL = `https://data.komiku.id/cari/?post_type=manga&s=${text}`;
	    let html = (await axios.get(BASE_URL)).data
	    let $ = cheerio.load(html), arr = []
	    $('div.bge').each((idx, el) => {
		arr.push({
			judul: $(el).find('div:nth-child(2) > a > h3').text().trim(),
			cover:  $(el).find('div:nth-child(1) > a  > img').attr('data-src').split('?')[0],
			genre:  $(el).find('div:nth-child(1) > a  > div').text().trim(),
			update: $(el).find('div:nth-child(2) > p').text().trim().split('.')[0],
            Chapter: $(el).find('div:nth-child(2) > div.new1 > a > span:nth-child(2)').text(),
            Link: $(el).find('div:nth-child(2) > a ').attr('href')
		})
	})
	arr.map(item => {
		item.Chapter = item.Chapter.replace(/Chapter\s\d+(\.\d+)?\Chapter /, "");
		return item;
	  });
	resolve(arr);
    })
}
function komikdetail(text) {
    return new Promise(async(resolve, reject) => {
        const BASE_URL = `https://komiku.id/manga/${text}`;
	    let html = (await axios.get(BASE_URL)).data
	    let $ = cheerio.load(html), arr = []
	    $('article').each((idx, el) => {
            let data = {
			sinopsis: $(el).find('header > p').text().replace(/\n|\t/g, "").trim(),
			genre:  $(el).find('section:nth-child(2) > ul > li > a').text().replace(/([a-z])([A-Z])/g, '$1, $2'),
			tipe:  $(el).find('section:nth-child(2) > table  > tbody > tr:nth-child(2) > td:nth-child(2) > a > b').text(),
			komikus:  $(el).find('section:nth-child(2) > table  > tbody > tr:nth-child(4) > td:nth-child(2)').text(),
			status:  $(el).find('section:nth-child(2) > table  > tbody > tr:nth-child(5) > td:nth-child(2)').text(),
			readCount:  $(el).find('section:nth-child(2) > table  > tbody > tr:nth-child(7) > td:nth-child(2)').text(),
		    };
            arr.push(data);
	})
    $('article > section:nth-child(6) > div:nth-child(8) > table > tbody > tr').each((idx, el)=> {
        arr.push({
            chapter: $(el).find('td > a > span').text(),
            link: $(el).find('td > a').attr("href"),
            date: $(el).find('td:nth-child(2)').text().trim(),

        })
    });
    arr.forEach(item => {
        item.link = 'https://komiku.id' + item.link;
      });
    
    resolve(arr);

    })
}
function twitter(url){
	return new Promise((resolve, reject) => {
		axios.get(`https://twitsave.com/info?url=${url}`, {
			headers: {
			  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			  "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
			  "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
			  "cookie": "_ga=GA1.1.653392267.1688829434; _pbjs_userid_consent_data=6683316680106290; _sharedID=1c94005d-acb7-44da-8f0b-108f26dcec28; _sharedID_last=Sat%2C%2008%20Jul%202023%2015%3A17%3A17%20GMT; _lr_retry_request=true; _lr_env_src_ats=false; cto_bundle=OFZ7pV94OTB6N2ZEMkpPaDR1ODdUMHhRUU5wdXhmNjZlRnk1JTJGUUQlMkJqVWc5bnZxSHZKNHF0NkNkdVVwNGl4UmJRJTJCaDJNYWJkNGVEdDlncE56aVYzZjg5SHMwc2djSUczd2g5MiUyQk1jSEhvNVZDc210UTRocE04dUNoNnJkTEt3dXVET3F0MlJmTjZxNjdhV2FsTU9tb1RnY3JwZyUzRCUzRA; cto_bidid=hq_OBV9SVmtYRkFxVCUyRkVoTGwlMkZiYWRqZnBDVkxDSDQxN3NyajRZOVBTUFYlMkIlMkZjVHlpVUt3b0lmT05YRnRaZjJ5RHJERjZTM3QzS3NJd0lYeHdCSCUyQjlWRDQ0ZW9MZWElMkJOdnhScnclMkJEJTJCVlJFJTJCYmx4MCUzRA; __gads=ID=5e0c21f46e988c6c:T=1688829441:RT=1688831166:S=ALNI_Mbbi_dPz64A7tK-3YK3djrUBjYHMQ; __gpi=UID=00000c1edad49b2b:T=1688829441:RT=1688831166:S=ALNI_MY16oGtobcNoqM6nb6ltpy5C4wf3g; XSRF-TOKEN=eyJpdiI6Ikttc29WSzJvMzFHVFQ0anRKUGlNdGc9PSIsInZhbHVlIjoiaXZsSlo3VDJ1UUJKaVJQbWl1S0h1L3pRS3NScGV6NkRzWUN5bmRyZDBLT253L3NkNDhBdU1rOHRuZ2RWQWdDaEFnY0h6SDUzbDBkOUtPcHRTcUw4RjcrejZHNXpQcGI4U3czZE13VU1UVC9RaElocENOVHNVek0ycFJzV3pWOWgiLCJtYWMiOiI3Mjg3OTAyMmJhZTY2YjFmY2IzZjMyNDY0MWQ4NmRkN2QxODNiMjY2OGQwN2I5Y2Y2ZjEzNmZlYTY0YWQ4NjRlIiwidGFnIjoiIn0%3D; twitsave_session=eyJpdiI6IjZYdDNyZUpmVkdQbFZoSStOWkFvRmc9PSIsInZhbHVlIjoiZGV0Mk9yT1JQZzAwMzZLb01pQURkbkxTUmRYQXpQbTh0OHhFVzFyRkNKZnJXZmIrSzhOYnl4NnUxQzZqaVR0UEtxd3hSOS9rSVdwZUFsSlowd2l0ZFBsUnQzOS9rN2EzL1YydGxEYkFZOW92K0VrU0doK1FIdWdPTVZLTms1UTAiLCJtYWMiOiI4YmE4MTk2YTE3ODZlMGJmZmVhMDRjYTYxNWNkMGJmYTIyMjliODc2YjhjZmRkYzVmNDE4N2IxNjI3MTQ5ZjViIiwidGFnIjoiIn0%3D; _ga_0WHXEN5JDY=GS1.1.1688829434.1.1.1688831407.0.0.0"
			}
		  })
		  .then(({ data }) => {
			let $ = cheerio.load(data);
			let arr = [];
			arr.push({
			  user: $('div > div.leading-tight > a').text().trim(),
			  desc: $('div:nth-child(1) > div:nth-child(1) > p').text().trim(),
			  HD: $('div:nth-child(2) > ul > li:nth-child(1) > a').attr('href'),
			  SD: $('div:nth-child(2) > ul > li:nth-child(2) > a').attr('href')
			})
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

module.exports = {openai, randomanime, updateanime, loli, musical, twitter, komikusearch}