const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

function updateanime() {
    return new Promise(async(resolve, reject) => {
        const BASE_URL = 'https://komiku.id/manga/kage-no-jitsuryokusha-ni-naritakute/';
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
// Usage
updateanime().then(result => {
    console.log(result);
  }) .catch(error => {
    console.error(error);
  });
  
