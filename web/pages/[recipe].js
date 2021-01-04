import PropTypes from 'prop-types'
import React from 'react'
import groq from 'groq'
import Layout from '../components/Layout'
import Method from '../components/Method'
import Ingredients from '../components/Ingredients'
import client from '../client'
import Banner from '../components/Banner'
import Controls from '../components/Controls/index'

export default function Recipe({ recipe }) {
  const { title, ingredients, method } = recipe

  return (
    <Layout>
      <main>
        <Banner>{title}</Banner>
        <Controls />
        <section className="max-w-4xl mx-auto p-4">
          <Ingredients ingredients={ingredients} />
          <Method ingredients={ingredients} method={method} />
        </section>
      </main>
    </Layout>
  )
}

Recipe.propTypes = {
  recipe: PropTypes.object,
}

export async function getStaticPaths() {
  const allRecipesQuery = groq`*[_type == "recipe"]`
  const allRecipesData = await client.fetch(allRecipesQuery).then((res) => res)
  const allRecipesPaths = allRecipesData.map((recipe) => ({
    params: {
      recipe: recipe.slug.current,
    },
  }))

  return {
    paths: allRecipesPaths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const recipeQuery = groq`
  *[_type == "recipe" && slug.current == "${params.recipe}"][0]{
    ...,
    ingredients[] {
      ...,
      ingredients[] {
        ...,
        ingredient->
      }
    }  
  }`
  const recipe = await client.fetch(recipeQuery).then((res) => res)

  return {
    props: { recipe },
  }
}
