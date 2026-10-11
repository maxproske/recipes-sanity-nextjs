import groq from 'groq'

// Recipes can sit in several categories (e.g. Desserts + Indian). Older docs
// may still carry the single `category` reference from before the migration,
// so fall back to it.
const categoriesProjection = groq`coalesce(categories[]->{_id, title}, [category->{_id, title}])`

export const recipeQuery = groq`
*[_type == "recipe" && slug.current == $slug]{
  ...,
  "categories": ${categoriesProjection},
  ingredientSets[] {
    ...,
    ingredients[] {
      ...,
      ingredient->
    }
  }
}`

// Categories that have at least one recipe, biggest first — drives the icon
// strip in the header on every page.
export const categoriesQuery = groq`*[_type == "category"]{
  _id,
  title,
  "count": count(*[_type == "recipe" && references(^._id)])
}[count > 0] | order(count desc)`

// Everything the search modal matches against, kept small: no method text.
export const searchIndexQuery = groq`*[_type == "recipe" && defined(slug.current)] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  featuredImage,
  "categories": coalesce(categories[]->title, [category->title]),
  "ingredients": array::unique(ingredientSets[].ingredients[].ingredient->title)
}`

export const allRecipesQuery = groq`*[_type == "recipe"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  featuredImage,
  "categories": ${categoriesProjection}
}`
