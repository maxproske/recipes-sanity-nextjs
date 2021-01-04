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
        <div className="p-12 border-b border-caramel-200">
          <Heading as="h1">All Recipes</Heading>
        </div>
        {recipeList.map((recipe) => (
          <article key={recipe._id} className="p-12 relative">
            <Heading>{recipe.title}</Heading>
            <Link href={`/${recipe.slug.current}`}>
              <a>
                View Recipe <span className="absolute inset-0" />
              </a>
            </Link>
          </article>
        ))}
      </main>
    </Layout>
  )
}

Home.propTypes = {
  recipeList: PropTypes.object,
}

export async function getStaticProps({ params }) {
  const allRecipesQuery = groq`*[_type == "recipe"]`
  const recipeList = await client.fetch(allRecipesQuery).then((res) => res)

  return {
    props: { recipeList },
  }
}
