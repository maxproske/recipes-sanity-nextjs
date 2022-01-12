import sanityClient from 'part:@sanity/base/client'

const previewSecret = `bji1nexeor5cuxtpqqexw3wnp7rdzo6d9nuqakjrckostkod`
// enable demo on the same Vercel or Netlify host, no matter what it is
const remoteUrl = `https://recipes.simeongriggs.dev`
const localUrl = `http://localhost:3000`

const client = sanityClient.withConfig({ apiVersion: `2021-05-19` })

export default async function resolveProductionUrl(doc, returnProd = false) {
  const baseUrl =
    window.location.hostname === 'localhost' && !returnProd
      ? localUrl
      : remoteUrl

  // Setup preview pathname and add secret
  const previewUrl = new URL(`${baseUrl}/api/preview`)
  previewUrl.searchParams.set(`secret`, previewSecret)

  // Add current dataset
  previewUrl.searchParams.set(`dataset`, client.clientConfig.dataset)

  previewUrl.searchParams.set(`slug`, doc?.slug?.current ?? `/`)
  return previewUrl.toString()
}
