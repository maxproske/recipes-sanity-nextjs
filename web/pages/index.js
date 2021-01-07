import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import groq from 'groq'
import Layout from '../components/Layout'
import client from '../client'
import Heading from '../components/Heading'

export default function Home({ recipeList }) {
  return (
    <Layout>
      <main className="min-h-screen">
        <div className="p-12 text-center">
          <Heading as="h1">All Recipes</Heading>
        </div>
        <div className="w-full max-w-4xl mx-auto divide-x-4 md:divide-x-0 md:grid md:grid-cols-3 md:gap-4 px-4">
          {recipeList.map((recipe) => (
            <article
              key={recipe._id}
              className="p-12 relative bg-white text-center"
            >
              <div className="absolute inset-0 m-2 md:m-4 border border-caramel-200" />
              <Heading>{recipe.title}</Heading>
              <Link href={`/${recipe.slug.current}`}>
                <a className="label">
                  View Recipe <span className="absolute inset-0" />
                </a>
              </Link>
            </article>
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
  const allRecipesQuery = groq`*[_type == "recipe"]`
  const recipeList = await client.fetch(allRecipesQuery).then((res) => res)

  return {
    props: { recipeList },
  }
}
