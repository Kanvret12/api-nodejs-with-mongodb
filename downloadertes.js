const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

function updateanime() {
    return new Promise(async(resolve, reject) => {
        const BASE_URL = 'https://data.komiku.id/cari/?post_type=manga&s=kage+no+jitsu';
	    let html = (await axios.get(BASE_URL)).data
	    let $ = cheerio.load(html), arr = []
	    $('div.bge').each((idx, el) => {
		arr.push({
			judul: $(el).find('div:nth-child(2) > a > h3').text().trim(),
			cover:  $(el).find('div:nth-child(1) > a  > img').attr('data-src').split('?')[0],
			genre:  $(el).find('div:nth-child(1) > a  > div').text().trim(),
			update: $(el).find('div:nth-child(2) > p').text().trim().split('.')[0],
            Chapter: $(el).find('div:nth-child(2) > div.new1 > a > span:nth-child(2)').text().replace('Chapter 1', ''),
            Link: $(el).find('div:nth-child(2) > a ').attr('href')
		})
        resolve(arr);
	})


    })
}
// Usage
updateanime().then(result => {
    console.log(result);
  }) .catch(error => {
    console.error(error);
  });
  
