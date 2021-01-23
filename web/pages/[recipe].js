import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import Image from 'next/image'
import groq from 'groq'
import { NextSeo } from 'next-seo'
import Layout from '../components/Layout'
import Method from '../components/Method'
import Ingredients from '../components/Ingredients'
import client from '../client'
import Banner from '../components/Banner'
import Controls from '../components/Controls/index'
import { urlFor } from '../lib/sanity'

const featuredImageSize = {
  width: 900,
  height: 400,
}
export default function Recipe({ recipe }) {
  const {
    title,
    featuredImage,
    description,
    ingredientSets,
    method,
    category,
  } = recipe
  const featuredImageUrl = useMemo(
    () =>
      urlFor(featuredImage)
        .width(featuredImageSize.width)
        .height(featuredImageSize.height)
        .url(),
    [featuredImage]
  )

  return (
    <Layout>
      <NextSeo title={title} description={description} />
      <main>
        <Banner description={description} category={category.title}>
          {title}
        </Banner>
        <Controls />
        <section className="max-w-4xl mx-auto p-4">
          <Ingredients ingredientSets={ingredientSets} />
          {featuredImageUrl && (
            <figure className="w-full h-auto mb-12">
              <Image
                className="object-cover"
                src={featuredImageUrl}
                alt={title}
                width={featuredImageSize.width}
                height={featuredImageSize.height}
              />
            </figure>
          )}
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
    category->,
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
