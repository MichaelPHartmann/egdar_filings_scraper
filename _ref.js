
// sources.forEach(source => {
//     axios.get(source.address)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html)
//
//             $('a:contains("climate")', html).each(function () {
//                 const title = $(this).text()
//                 const url = $(this).attr('href')
//
//                 articles.push({
//                     title,
//                     url: source.base + url,
//                     source: source.name
//                 })
//             })
//
//         })
// })
//
// app.get('/news/:sourceId', (req, res) => {
//     const sourceId = req.params.sourceId
//
//     const sourceAddress = sources.filter(source => source.name == sourceId)[0].address
//     const sourceBase = sources.filter(source => source.name == sourceId)[0].base
//
//
//     axios.get(sourceAddress)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html)
//             const specificArticles = []
//
//             $('a:contains("climate")', html).each(function () {
//                 const title = $(this).text()
//                 const url = $(this).attr('href')
//                 specificArticles.push({
//                     title,
//                     url: sourceBase + url,
//                     source: sourceId
//                 })
//             })
//             res.json(specificArticles)
//         }).catch(err => console.log(err))
// })
