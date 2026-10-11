import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'

import CategoryChips from './CategoryChips'
import SearchModal from './SearchModal'

// Two-tone header after Bong Eats: a darker caramel band with the home link,
// search and family name, and a paler band with the category icon strip.
function GlobalHeader({ categories }) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Homepage: underline the filtered category, or "All". Elsewhere: none.
  const activeSlug =
    router.pathname === '/' ? router.query.category || null : undefined

  return (
    <header className="font-sans">
      <div className="bg-caramel-200">
        {/* Mobile: [‹] + full-width search. md+: Home | search | family name,
            with the outer columns sharing the leftover width so the search
            box stays centred. */}
        <div className="max-w-6xl mx-auto flex items-center gap-3 md:gap-4 px-4 py-3 label text-caramel-500">
          <div className="shrink-0 md:flex-1 md:basis-0 min-w-0">
            {router.pathname !== '/' && (
              <Link
                href="/"
                aria-label="Home"
                className="inline-flex items-center hover:text-caramel-700 -ml-1 p-1 md:ml-0 md:p-0"
              >
                <ChevronLeftIcon className="w-5 md:w-4 h-auto md:mr-1" />
                <span className="hidden md:inline">Home</span>
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex-1 md:flex-none md:w-full md:max-w-xl flex items-center gap-2 rounded-md border border-caramel-300 bg-white px-3 py-2 text-left font-sans text-base normal-case tracking-normal font-normal text-caramel-500 hover:border-caramel-400 transition-colors duration-100"
          >
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0" />
            <span className="flex-1">Search</span>
          </button>

          <div className="hidden md:block flex-1 basis-0 text-right whitespace-nowrap">
            Proske, Swanson & Mahato
          </div>
        </div>
      </div>

      <CategoryChips categories={categories} activeSlug={activeSlug} />

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </header>
  )
}

GlobalHeader.propTypes = {
  categories: PropTypes.array,
}

export default GlobalHeader
