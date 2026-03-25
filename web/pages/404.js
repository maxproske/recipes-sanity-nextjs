import React from 'react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Layout from '../components/Layout'
import Heading from '../components/Heading'

export default function NotFound() {
  return (
    <Layout>
      <NextSeo title="Page Not Found" />
      <main className="pb-24">
        <div className="p-12 text-center max-w-md mx-auto">
          <Heading as="h1">Page Not Found</Heading>
          <p className="text-caramel-500 mt-4 mb-8">
            Sorry, we couldn&apos;t find that recipe. It may have been moved or
            doesn&apos;t exist.
          </p>
          <Link href="/" className="text-caramel-800 underline hover:text-caramel-600 font-display uppercase tracking-widest text-sm">
              Back to all recipes
          </Link>
        </div>
      </main>
    </Layout>
  )
}
