const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Papa = require('papaparse');
const fs = require('fs');


const getHTML = async () => {
    const websiteUrl = 'https://www.imdb.com/list/ls000441429/?sort=moviemeter,asc&st_dt=&mode=detail&page=1&ref_=ttls_vm_dtl';
    const response = await axios.get(websiteUrl);
    return response.data;
  }
  // Coverting data to excel format
const convert = (htmlString) => {
    const dom = new JSDOM(htmlString);
    const { document } = dom.window;
    const element = document.querySelectorAll('.lister-item.mode-detail');

    const movies = [];
    for(let i = 0; i < element.length; i++) {
      const card = element[i];
      movies[i] = {
        name: card.querySelector('.lister-item-header a').textContent,
            releaseDate: card.querySelector('.lister-item-year')
                        .textContent
                        .replace('(', '')
                        .replace(')', ''),
              description: card.querySelector('.lister-item-content p:nth-of-type(2)')
                          .textContent
                          .replace('\n', '')
                          .trim(),  
               genre: card.querySelector('.genre')
                          .textContent
                          .replace('\n', '')
                          .trim(),
                runtime: card.querySelector('.runtime').textContent,
                image: card.querySelector('.loadlate').getAttribute('loadlate'),
                rating:card.querySelector('.ipl-rating-star__rating').textContent,
      }
    }
    return movies;
}
const createExcel = (movieData) => {
    const csv = Papa.unparse(movieData);
    fs.writeFileSync('movies.csv', csv);
}
    
const main = async()=>{
    const html = await getHTML();
    const converted=convert(html);
    createExcel(converted);
}
main();
