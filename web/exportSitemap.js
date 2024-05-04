const sm = require('sitemap')
const fs = require('fs')
const { sanityClient } = require('./lib/sanity.server.js')

const query = `
{
  "routes": *[_type == "recipe"] {
    _id,
    slug,
  }
}
`

const reduceRoutes = (obj, route) => {
  const path = route.slug.current === '/' ? '/' : `/${route.slug.current}`
  obj[path] = {}
  return obj
}

client
  .fetch(query)
  .then((res) => {
    const { routes = [] } = res
    const nextRoutes = routes
      .filter(({ slug }) => slug.current)
      .reduce(reduceRoutes, {})

    return nextRoutes
  })
  .then((res) => {
    const sitemap = sm.createSitemap({
      hostname: `https://recipes.mproske.com`,
      cacheTime: 600000, // 600 sec (10 min) cache purge period
    })

    Object.keys(res).map((page) => sitemap.add({ url: page }))

    fs.writeFile(`./public/sitemap.xml`, sitemap.toString(), (err) => {
      if (err) throw err
      console.log(`sitemap.xml updated`)
    })
  })
