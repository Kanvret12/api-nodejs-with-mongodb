const { default: axios } = require('axios');
const cheerio = require('cheerio')
async function fbDown(url) {
  try {
    if (url.includes('web_id')) {
        const photos = await axios(`https://seal-app-5orhr.ondigitalocean.app/download/photos?url=${url}`, {
          method: 'GET',
        })
        const data = photos.data;
        console.log(data);
      } else {
        const post = await axios(`https://www.tiktok.com/oembed?url=${url}`, {
            method: 'GET',
        });
        const data = post.data;
        const $ = cheerio.load(data);
        let arr = [];
        arr.push({
          title: data.title,
          author_url: data.author_url,
          author_name: data.author_name,
          thumbnail_url: data.thumbnail_url,
          author_unique_id: data.author_unique_id,
          mp4_link: `https://seal-app-5orhr.ondigitalocean.app/download/video?url=${url}`,
          mp3_link: `https://seal-app-5orhr.ondigitalocean.app/download/mp3?url=${url}`,
        });
        console.log(arr)
    }
} catch (error) {
    console.error(error);
    return {
        status: false,
        result: 'Video private / terjadi error'
    };
}
}

fbDown()
    .then(data => console.log(data))
    .catch(e => console.log(e))

    //https://www.tiktok.com/@silvyqueen12/video/7252642004662848774?is_from_webapp=1&sender_device=pc&web_id=7282087021752026631