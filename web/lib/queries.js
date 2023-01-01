import groq from 'groq'

export const recipeQuery = groq`
*[_type == "recipe" && slug.current == $slug]{
  ...,
  category->,
  ingredientSets[] {
    ...,
    ingredients[] {
      ...,
      ingredient->
    }
  }  
}`

export const allRecipesQuery = groq`*[_type == "recipe"] | order(_createdAt desc) {
  ...,
  category->
}`
