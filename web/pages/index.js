import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Head from 'next/head'

import Layout from '../components/Layout'
import Heading from '../components/Heading'
import RecipeCard from '../components/RecipeCard'
import { getClient } from '../lib/sanity.server'
import { allRecipesQuery } from '../lib/queries'

export default function Home({ recipeList }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecipes = recipeList.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <NextSeo title="Half The Sugar, Twice The Ginger" />
      <Head>
        <link rel="icon" href="/img/logo-transparent.png" />
      </Head>
      <main className="pb-24">
        <div className="p-12 text-center">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-10 px-4 py-2 border border-caramel-300 rounded-md shadow-sm focus:outline-none focus:border-caramel-500 transition duration-150 ease-in-out placeholder-caramel-400"
          />

          <div className="flex justify-center items-center">
            <div className="w-24 inline-block">
              <Image
                src="/img/logo-transparent.png"
                height="360"
                width="360"
                alt="Logo"
              />
            </div>
            <div>
              <Heading as="h1">
                Half The Sugar,
                <br /> Twice The Ginger
              </Heading>
              <span className="text-caramel-300 italic font-xs">
                {recipeList.length} recipes and counting!
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {filteredRecipes.map((recipe) => (
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
    revalidate: 60,
  }
}
