export default function exitPreview(req, res) {
  res.clearPreviewData()

  const slug = req?.query?.slug ?? '/'

  res.writeHead(307, { Location: slug.startsWith('/') ? slug : `/${slug}` })
  res.end()
}
