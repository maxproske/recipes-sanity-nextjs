const client = require('./client')

const query = `
{
  "routes": *[_type == "recipe"] {
    _id,
    slug,
    title,
  }
}
`

const reduceRoutes = (obj, route) => {
  // const { page = {}, slug = {} } = route
  // const { _createdAt, _updatedAt } = page
  const path = route.slug.current === '/' ? '/' : `/${route.slug.current}`
  obj[path] = {
    // query: {
    //   slug: slug.current,
    // },
    // includeInSitemap,
    // disallowRobot,
    // _createdAt,
    // _updatedAt,
    // page: '/LandingPage',
  }
  return obj
}

module.exports = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  exportPathMap() {
    return client.fetch(query).then((res) => {
      const { routes = [] } = res
      const nextRoutes = routes
        .filter(({ slug }) => slug.current)
        .reduce(reduceRoutes, {})

      return nextRoutes
    })
  },
}
