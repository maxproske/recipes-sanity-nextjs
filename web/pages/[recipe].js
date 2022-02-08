import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import Image from 'next/image'
import groq from 'groq'
import { NextSeo } from 'next-seo'

import { urlFor, usePreviewSubscription } from '../lib/sanity'
import { filterDataToSingleItem } from '../lib/filterDataToSingleItem'
import { getClient } from '../lib/sanity.server'
import { recipeQuery } from '../lib/queries'

import Layout from '../components/Layout'
import Method from '../components/Method'
import Ingredients from '../components/Ingredients'
import ExitPreview from '../components/ExitPreview'
import Banner from '../components/Banner'
import Controls from '../components/Controls'

const featuredImageSize = {
  width: 1200,
  height: 600,
}
export default function Recipe({ data, preview }) {
  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    // The hook needs to know what we started with, to return it immediately
    // This is what it's important to fetch draft content server-side!
    initialData: data.page,
    // The passed-down preview context determines whether this function does anything
    enabled: preview,
  })

  const page = filterDataToSingleItem(previewData, preview)

  const {
    title,
    featuredImage,
    description,
    ingredientSets,
    method,
    category,
  } = page ?? {}

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
      {preview && <ExitPreview />}
      <main>
        <Banner description={description} category={category?.title}>
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

export async function getStaticProps({ params, preview = false }) {
  const recipeParams = { slug: params.recipe }
  const data = await getClient(preview).fetch(recipeQuery, recipeParams)

  // Escape hatch, if our query failed to return data
  if (!data) return { notFound: true }

  // Helper function to reduce all returned documents down to just one
  const page = filterDataToSingleItem(data, preview)

  return {
    props: {
      // Pass-down the preview context
      preview,
      // Pass-down the initial content, and our query
      data: {
        page: page ?? null,
        query: preview ? recipeQuery : null,
        // query: recipeQuery,
        queryParams: preview ? recipeParams : null,
        // queryParams: recipeParams,
      },
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const allRecipesQuery = groq`*[_type == "recipe" && defined(slug.current)][].slug.current`
  const allRecipeSlugs = await getClient().fetch(allRecipesQuery)

  // We'll pre-render only these paths at build time.
  // fallback blocking will server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths: allRecipeSlugs.map((slug) => `/${slug}`),
    fallback: 'blocking',
  }
}
