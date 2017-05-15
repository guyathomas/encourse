const request = require('request');
const cheerio = require('cheerio');
const Promise = require("bluebird");
const axios = require('axios');

module.exports = {
    udemyPage: function(url, progress, total, set) {
        return new Promise((resolve, reject) => {
            request(url, function(error, response, html) {
                if (!error && response.statusCode == 200) {
                    let description = 'Not Found';
                    let duration = 'Not Found';
                    let learnings = 'Not Found';
                    const $ = cheerio.load(html);
                    $('.js-simple-collapse-inner').each(function(i, element) {
                        //Loads 3 items. 1) What you will learn 2) Description 3) About the author
                        if (i === 0) {
                            learnings = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != '')).slice(1, -1).join('\n').split('\t').map((el) => (el.trim())).filter((el) => (el != '')).join('\n')
                        } else if (i === 1) {
                            description = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != '')).slice(1, -1).join('\n').split('\t').map((el) => (el.trim())).filter((el) => (el != '')).join('\n')
                        }

                    });

                    $('.incentives__text').each(function(i, element) {
                        //Only want the first item in the array (duration)
                        if (i === 0) {
                            duration = $(element).text().split('\n').map((el) => (el.trim())).filter((el) => (el != ''))[0]
                        }
                    });
                    // console.log('Processed', progress, 'out of', total, 'in set', set)
                    resolve([description, learnings, duration])
                } else {
                    reject(error)
                }
                return;
            });
        })
    },
    udemyAPI: function(currPage, pageSize, topic) {
        console.log('will query the api with', `https://www.udemy.com/api-2.0/courses?page=${currPage}&page_size=${pageSize}&language=en&ordering=highest-rated&category=${topic}`)
        return new Promise((resolve, reject) => {
            axios.get(`https://www.udemy.com/api-2.0/courses?page=${currPage}&page_size=${pageSize}&language=en&ordering=highest-rated&category=${topic}`, {
                withCredentials: true,
                    auth: {
                      username: process.env.UDEMY_USERNAME,
                      password: process.env.UDEMY_PASSWORD
                    }
            })
            .catch((err) => {reject(err)})
            .then((page) => {resolve(page)})
        })
    }
}