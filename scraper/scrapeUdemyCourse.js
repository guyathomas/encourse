const request = require('request');
const cheerio = require('cheerio');
const Promise = require("bluebird");

function scrapeUdemyCourse (url, progress, total) {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                let description;
                let duration;
                let learnings;
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
                        duration = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != ''))[0]
                    }
                });
                console.log('Processed', (progress - 1)/ 2,'out of', total / 2)
                resolve([description, learnings, duration])
           } else {
                reject(error)
            }
            return;
    });
})
}

module.exports = scrapeUdemyCourse;
