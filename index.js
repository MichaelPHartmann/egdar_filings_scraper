

const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

app.get('/', (req, res) => {
    res.json('Welcome to my EDGAR Filings API')
})

app.get('/filings', (req, res) => {
  const urlBase = 'https://www.sec.gov'
  let latestUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent'
  axios.get(latestUrl)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const feed = []
        let nameHolder = ''
        let nameLine = true

        $("tr", html).each(function () {

          if (nameLine) {
            nameHolder = $(this).text().replace(/\r?\n|\r/g, "");
            nameLine = !nameLine;
          } else {
            const statement = $(this).find("td:first-child").text();
            const filingDate = $(this).find("td:nth-of-type(4)").text();
            const description = $(this).find('.small').text();
            const htmlLink = $(this).find("a:contains('html')").attr('href');
            const textLink = $(this).find("a:contains('text')").attr('href');
            feed.push({
              nameHolder,
              statement,
              filingDate,
              htmlLink: urlBase + htmlLink,
              textLink: urlBase + textLink
            })
           nameLine = !nameLine
          };

          })
    res.json(feed)
  }).catch(err => console.log(err))
});

app.get('/filings/:ticker', (req, res) => {
  const symbol = req.params.ticker;
  const urlBase = 'https://www.sec.gov'
  let tickerUrlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&owner=include`

  axios.get(urlBase + tickerUrlExtend)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const feed = [];

      $("tr", html).each(function () {
        let url = $(this).find("a:contains('Documents')").attr("href")
          if (typeof url === 'undefined') {
            console.log('Undefined string detected.')
          } else {
            let statement = $(this).find("td:first-child").text()
            let rawFiling = url.replace('-index.htm', '.txt')
            let title = $(this).find(".small").text()
            feed.push({
              title,
              statement,
              rawFiling: urlBase + rawFiling,
              url: urlBase + url
            })
          }
      })
      res.json(feed)
    }).catch(err => console.log(err))
})

app.get('/filings/:ticker/:statement', (req, res) => {
  const symbol = req.params.ticker;
  const statementType = req.params.statement
  const urlBase = 'https://www.sec.gov'
  let tickerUrlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&owner=include&type=${statementType}`

  axios.get(urlBase + tickerUrlExtend)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const feed = [];

      $("tr", html).each(function () {
        let url = $(this).find("a:contains('Documents')").attr("href")
          if (typeof url === 'undefined') {
            console.log('Undefined string detected.')
          } else {
            let statement = $(this).find("td:first-child").text()
            let rawFiling = url.replace('-index.htm', '.txt')
            let title = $(this).find(".small").text()
            feed.push({
              title,
              statement,
              rawFiling: urlBase + rawFiling,
              url: urlBase + url
            })
          }
      })
      res.json(feed)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
