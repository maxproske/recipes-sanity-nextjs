import { getClient } from '../lib/sanity.server'

const SITE_URL = 'https://recipes.mproske.com'

function generateSiteMap(slugs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc></url>
  ${slugs.map((slug) => `<url><loc>${SITE_URL}/${slug}</loc></url>`).join('\n  ')}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const slugs = await getClient().fetch(
    '*[_type == "recipe" && defined(slug.current)][].slug.current'
  )

  const sitemap = generateSiteMap(slugs)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  )
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function SiteMap() {
  // getServerSideProps handles the response
}
