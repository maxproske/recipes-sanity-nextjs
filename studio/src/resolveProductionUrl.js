const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET
const remoteUrl = `https://recipes.mproske.com`
const localUrl = `http://localhost:3000`

export default function resolveProductionUrl(doc) {
  const baseUrl =
    window.location.hostname === 'localhost' ? localUrl : remoteUrl

  const previewUrl = new URL(`${baseUrl}/api/preview`)
  previewUrl.searchParams.set(`secret`, previewSecret)
  previewUrl.searchParams.set(`dataset`, `production`)
  previewUrl.searchParams.set(`slug`, doc?.slug?.current ?? `/`)
  return previewUrl.toString()
}
