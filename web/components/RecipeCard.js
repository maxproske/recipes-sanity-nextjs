import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import Heading from './Heading'
import { urlFor } from '../lib/sanity'

const featuredImageSize = {
  width: 600,
  height: 300,
}

function RecipeCard({ recipe }) {
  const { title, slug, _id, featuredImage, category } = recipe

  const featuredImageUrl = useMemo(
    () =>
      urlFor(featuredImage)
        .width(featuredImageSize.width)
        .height(featuredImageSize.height)
        .url(),
    [featuredImage]
  )
  return (
    <article
      key={_id}
      className="relative bg-white text-center transition-transform duration-200 transform hover:-translate-y-1 focus:-translate-y-1"
    >
      {featuredImageUrl && (
        <figure className="w-full h-auto">
          <Image
            className="object-cover"
            src={featuredImageUrl}
            alt={title}
            width={featuredImageSize.width}
            height={featuredImageSize.height}
          />
        </figure>
      )}
      <div className="px-12 pt-6 pb-12">
        <span className="absolute inset-0 m-2 md:m-4 border border-caramel-200 pointer-events-none" />
        <Heading>
          <Link href={slug?.current}>
            <a>
              {title}
              <span className="absolute inset-0" />
            </a>
          </Link>
        </Heading>
        {category?.title && (
          <p className="font-serif italic text-caramel-500 mb-2">
            {category.title}
          </p>
        )}
      </div>
    </article>
  )
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string,
    category: PropTypes.shape({
      title: PropTypes.string,
    }),
    featuredImage: PropTypes.string,
    slug: PropTypes.shape({
      current: PropTypes.string,
    }),
    title: PropTypes.string,
  }),
}

export default RecipeCard
