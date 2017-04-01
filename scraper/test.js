const cheerio = require('cheerio');
var request = require('request');

request('https://www.udemy.com/the-step-by-step-guide-to-setting-up-a-100mm-startup/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('.js-simple-collapse-inner').each(function(i, element){
    	//Loads 3 items. 1) What you will learn 2) Description 3) About the author
    	const description = $(this).text().split('\n').map((el) => (el.trim())).filter((el) => (el != ''))
    });

    $('.incentives__text').each(function(i, element){
    	//Only want the first item in the array (duration)
    	const description = $(this).text().split('\n').map((el) => (el.trim())).filter((el) => (el != ''))
    });
  }
});