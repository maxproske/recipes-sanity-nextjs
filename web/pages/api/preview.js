export default async function preview(req, res) {
  const corsOrigin =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3333`
      : `https://recipe.sanity.studio`

  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== `bji1nexeor5cuxtpqqexw3wnp7rdzo6d9nuqakjrckostkod`) {
    return res.status(401).json({ message: `Invalid Secret` })
  }

  if (!req.query.slug) {
    return res.status(401).json({ message: 'No slug in query' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    dataset: req?.query?.dataset ?? ``,
    // projectId: req?.query?.projectId ?? ``,
  })

  const pathname = req?.query?.slug ?? `/`

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  return res
    .writeHead(307, {
      Location: pathname.startsWith(`/`) ? pathname : `/${pathname}`,
    })
    .end()
}
