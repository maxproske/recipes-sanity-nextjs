import PropTypes from 'prop-types'
import React from 'react'
import Image from 'next/image'
import groq from 'groq'
import Layout from '../components/Layout'
import Method from '../components/Method'
import Ingredients from '../components/Ingredients'
import client from '../client'
import Banner from '../components/Banner'
import Controls from '../components/Controls/index'

export default function Recipe({ recipe }) {
  const { title, description, ingredientSets, method } = recipe

  return (
    <Layout>
      <main>
        <Banner description={description}>{title}</Banner>
        <Controls />
        <section className="max-w-4xl mx-auto p-4">
          <Ingredients ingredientSets={ingredientSets} />
          <figure className="w-full h-auto mb-12">
            <Image
              className="object-cover"
              src="/images/caramel-slice.jpg"
              alt=""
              width={900}
              height={350}
            />
          </figure>
          <Method ingredientSets={ingredientSets} method={method} />
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
    ingredientSets[] {
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
