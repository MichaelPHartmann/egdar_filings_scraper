const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



const ticker = 'AAPL'
const statement = '10-K'
const last = 10

console.log(`The ticker is '${ticker}' and you requested the last ${last} of the statement type '${statement}'.`);
const urlBase = 'https://www.sec.gov'
const urlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&owner=include&&count=${last}type=${statement}`



//
// /**
// * A function to gather urls for filings.
// * @param  {string} ticker The ticker or symbol of the company you want to access filings for.
// * @param  {string} statement The statement type you want to access for the specified company. Right now only '10-K' and '10-Q' are supported.
// * @param  {int} last The number of results you want returned. Valid arguments are: [10, 20, 40, 80, 100]
// * @return {array} An array containing an object with the date and url of each filing.
// */
// axios.get(urlBase + urlExtend)
//   .then(response => {
//     // Define the searchable html object using cheerio
//     const html = response.data;
//     const $ = cheerio.load(html);
//     // Initialize the empty array for the results to be pushed to.
//     const feed = []
//
//     // Select all elements with the 'tr' tag and loop through each of them
//     $("tr", html).each(function () {
//       let url = $(this).find("a:contains('Documents')").attr("href")
//       // Check that the 'tr' element has a valid documents url attached to it.
//       // Maybe a better way to do this, but continue syntax does not work on the cheerios .each() method
//         if (typeof url === 'undefined') {
//           console.log('Undefined string detected.')
//         } else {
//           // Conveniently, if you just replace the end of the URL you get the text filing document
//           // We add the url base because the href only contains the partial url
//           let filingLink = urlBase + url.replace('-index.htm', '.txt')
//           // Date is a text-only 'td' tag and is always the fourth element in the 'tr' parent
//           const filingDate = $(this).find("td:nth-of-type(4)").text();
//           let title = $(this).find(".small").text()
//           // Push the filing date and filing link to the array.
//           feed.push({
//             title,
//             filingDate,
//             filingLink
//           })
//         }
//     })
//     return feed
//     console.log(feed)
//   }).catch(err => console.log(err));
