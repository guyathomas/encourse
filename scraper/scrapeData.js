const cheerio = require('cheerio');
var request = require('request');
const Promise = require("bluebird");

function scrapeData (url) {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                let description;
                let duration;
                let learnings;
                console.log('Request run with no error')
                const $ = cheerio.load(html);
                $('.js-simple-collapse-inner').each(function(i, element){
                 //Loads 3 items. 1) What you will learn 2) Description 3) About the author
                    if (i === 0) {
                        learnings = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != '')).slice(1, -1).join('\n').split('\t').map((el) => (el.trim())).filter((el) => (el != '')).join('\n')
                    } else if (i === 1) {
                        description = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != '')).slice(1, -1).join('\n').split('\t').map((el) => (el.trim())).filter((el) => (el != '')).join('\n')
                    }
                    
                });

                $('.incentives__text').each(function(i, element){
                 //Only want the first item in the array (duration)
                    if (i === 0) {
                        // const aboutFields = $(this).text().split('\n').map((el) => (el.trim())).filter((el) => (el != ''))
                        duration = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != ''))[0]
                    // console.log('duration is going to be created as', duration)
                    }
                });
                // console.log('ABout to resolve on ',url, [learnings, description, duration])
                resolve([description, learnings, duration])
           } else {
                reject(error)
            }
            return;
    });
})
}

module.exports = scrapeData;
