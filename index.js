const PORT = process.env.PORT || 8001
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

app.get('/', (req, res) => {
    res.json('Welcome to my EDGAR Filings API')
})

app.get('/filings', (req, res) => {
  /**
  Returns JSON containing the most recent EDGAR Filings from any entity.
  */
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
          // The entries for each filing are separated into two table rows
          // I utilize a bool switch which is not super reliable but the schema of the html is dependable
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
  /**
  Returns JSON containing the most recent filings for the given company.
  The rawFiling key brings you to the original filing document (usually XML)
  The url key brings you to the page for that filing with every document contained in the filing.
  */
  const symbol = req.params.ticker;
  const urlBase = 'https://www.sec.gov'

  // Checks whether a count query param has been entered and builds the correct url
  let urlExtend
  if (req.query.count) {
    const nLast = req.query.count
    urlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&owner=include&count=${nLast}`
  } else {urlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&owner=include`}

  // Axios is used to retrieve the url response promise, which is then handled asynchronously
  axios.get(urlBase + urlExtend)
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
  /**
  Returns JSON containing the most recent filings for the given company by statement type.
  The rawFiling key brings you to the original filing document (usually XML)
  The url key brings you to the page for that filing with every document contained in the filing.
  */
  const symbol = req.params.ticker;
  const statementType = req.params.statement
  const urlBase = 'https://www.sec.gov'

  let urlExtend
  if (req.query.count) {
    const nLast = req.query.count
    urlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&owner=include&type=${statementType}&count=${nLast}`
  } else {urlExtend = `/cgi-bin/browse-edgar?action=getcompany&CIK=${symbol}&owner=include&type=${statementType}`}

  axios.get(urlBase + urlExtend)
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
