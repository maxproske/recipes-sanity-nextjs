const sm = require('sitemap')
const fs = require('fs')
const { exportPathMap } = require('./next.config')

exportPathMap().then((res) => {
  const sitemap = sm.createSitemap({
    hostname: `https://recipes.simeongriggs.dev`,
    cacheTime: 600000, // 600 sec (10 min) cache purge period
  })

  Object.keys(res).map((page) => sitemap.add({ url: page }))

  fs.writeFile(`./public/sitemap.xml`, sitemap.toString(), (err) => {
    if (err) throw err
    console.log(`sitemap.xml updated`)
  })
})
