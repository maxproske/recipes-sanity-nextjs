import PropTypes from 'prop-types'
import React from 'react'
import groq from 'groq'
import { NextSeo } from 'next-seo'
import Layout from '../components/Layout'
import client from '../client'
import Heading from '../components/Heading'
import RecipeCard from '../components/RecipeCard'

export default function Home({ recipeList }) {
  return (
    <Layout>
      <NextSeo title="All Recipes" description="A simeonGriggs Side Project" />
      <main className="pb-24">
        <div className="p-12 text-center">
          <Heading as="h1">All Recipes</Heading>
        </div>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {recipeList.map((recipe) => (
            <RecipeCard key={recipe._key} recipe={recipe} />
          ))}
        </div>
      </main>
    </Layout>
  )
}

Home.propTypes = {
  recipeList: PropTypes.array,
}

export async function getStaticProps({ params }) {
  const allRecipesQuery = groq`*[_type == "recipe"]{
    ...,
    category->
  }`
  const recipeList = await client.fetch(allRecipesQuery).then((res) => res)

  return {
    props: { recipeList },
  }
}
