import React from 'react'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'

import Layout from '../components/Layout'
import Heading from '../components/Heading'
import RecipeCard from '../components/RecipeCard'
import { getClient } from '../lib/sanity.server'
import { allRecipesQuery } from '../lib/queries'

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
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </main>
    </Layout>
  )
}

Home.propTypes = {
  recipeList: PropTypes.array,
}

export async function getStaticProps({ params, preview }) {
  const recipeList = await getClient(preview).fetch(allRecipesQuery)

  return {
    props: { recipeList },
  }
}
