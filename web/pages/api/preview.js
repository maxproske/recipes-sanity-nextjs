export default async function preview(req, res) {
  const corsOrigin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3333'
      : process.env.SANITY_STUDIO_URL || 'https://www.sanity.io'

  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.query.secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  if (!req.query.slug) {
    return res.status(400).json({ message: 'Missing slug parameter' })
  }

  const { getClient } = await import('../../lib/sanity.server')
  const exists = await getClient(true).fetch(
    'count(*[slug.current == $slug]) > 0',
    { slug: req.query.slug }
  )

  if (!exists) {
    return res.status(404).json({ message: 'Document not found' })
  }

  res.setPreviewData({
    dataset: req.query.dataset ?? '',
  })

  const pathname = req.query.slug
  res.redirect(307, pathname.startsWith('/') ? pathname : `/${pathname}`)
}
