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
      <main className="pb-24">
        <div className="p-12 text-center">
          <Heading as="h1">All Recipes</Heading>
        </div>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {recipeList.map((recipe) => (
            <article
              key={recipe._id}
              className="p-12 relative bg-white text-center"
            >
              <div className="absolute inset-0 m-2 md:m-4 border border-caramel-200" />
              <Heading>{recipe.title}</Heading>
              {recipe?.category?.title && (
                <p className="font-serif italic text-caramel-500 mb-2">
                  {recipe.category.title}
                </p>
              )}
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
  const allRecipesQuery = groq`*[_type == "recipe"]{
    ...,
    category->
  }`
  const recipeList = await client.fetch(allRecipesQuery).then((res) => res)

  return {
    props: { recipeList },
  }
}
