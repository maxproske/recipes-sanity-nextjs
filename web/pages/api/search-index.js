import { getClient } from '../../lib/sanity.server'
import { urlFor } from '../../lib/sanity'
import { searchIndexQuery } from '../../lib/queries'

// Lightweight index for the header search modal, fetched the first time the
// modal opens. Cached at the edge so typing never waits on Sanity.
export default async function searchIndex(req, res) {
  const recipes = await getClient().fetch(searchIndexQuery)

  const index = recipes.map(({ featuredImage, ...recipe }) => ({
    ...recipe,
    ingredients: (recipe.ingredients || []).filter(Boolean),
    thumb: featuredImage
      ? urlFor(featuredImage).width(128).height(128).fit('crop').url()
      : null,
  }))

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=86400'
  )
  res.status(200).json(index)
}
