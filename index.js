const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const urlREGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


app.get('/', function (req, res) {
    res.json('This is my webscraper')
})

app.get('/economia/clarin', async (req, res) => {
    let results = await cheerioPick('https://www.clarin.com', '/economia', '.content-nota', 'h2', 'a')
    res.send(results)
})

app.get('/economia/lanacion', async (req, res) => {
    let results = await cheerioPick('https://www.lanacion.com.ar', '/economia', '.mod-article', 'a', 'a')
    res.send(results)
})

app.get('/economia/perfil', async (req, res) => {
    let results = await cheerioPick('https://www.perfil.com', '/seccion/economia', '.articulo', 'h2', 'a')
    res.send(results)
})


app.get('/economia/infobae', async (req, res) => {
    let results = await cheerioPick('https://www.infobae.com', '/tag/economia/', '.nd-feed-list-card', 'h2', '')
    res.send(results)
})

app.get('/economia/ambito', async (req, res) => {
    let results = await cheerioPick('https://www.ambito.com', '/contenidos/economia.html', 'article', 'a', 'a')
    console.log(results)
    res.send(results)
})

async function cheerioPick(domain, route, container, titletag, urltag) {
    try {
        let response = await axios(domain + route);
        console.log(response)
        let html = response.data
        let $ = cheerio.load(html)
        let articles = []

        $(container, html).each(function () {
            let title , url
            titletag == '' ? title = $(this).text() : title = $(this).find(titletag).text()
            urltag == '' ? url = $(this).attr('href') : url = $(this).find(urltag).attr('href')
            image = $(this).find('img').attr('src')

            if (!urlREGEX.test(url)){
                url = domain + url
            }
            if (!urlREGEX.test(image)){
                image = domain + image
            }
            
            articles.push({
                title,
                url,
                image
            })
        })
        return articles
    } catch (error) {
      console.log(error)
    }
}


// async function cheerioPick(url, container, titletag, urltag, domain) {
//     axios(url)
//     .then(response => {
//         const html = response.data
//         const $ = cheerio.load(html)
//         const articles = []

//         $(container, html).each(function () { //<-- cannot be a function expression
//             const title = $(this).find(titletag).text()
//             const url = domain + $(this).find(urltag).attr('href')
//             articles.push({
//                 title,
//                 url
//             })
//         })
//         console.log("articles")
//         return articles
//     })
//     .catch(err => console.log(err))
// }


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

