import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Portal } from 'react-portal'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

// Fetched once per page load, the first time the modal opens.
let indexPromise = null
const loadIndex = () => {
  if (!indexPromise) {
    indexPromise = fetch('/api/search-index')
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => {
        indexPromise = null
        return []
      })
  }
  return indexPromise
}

// Sanity returns null (not undefined) for empty fields, so no default param.
const normalize = (text) =>
  (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Every word of the query has to appear somewhere; title hits rank highest.
function search(index, query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []

  return index
    .map((recipe) => {
      const title = normalize(recipe.title)
      const description = normalize(recipe.description)
      const category = normalize((recipe.categories || []).join(' '))
      const ingredients = recipe.ingredients.map(normalize)

      let score = 0
      const matchedIngredients = new Set()
      const allMatch = tokens.every((token) => {
        let hit = false
        if (title.startsWith(token)) (score += 100), (hit = true)
        else if (title.includes(token)) (score += 60), (hit = true)
        if (category.includes(token)) (score += 30), (hit = true)
        ingredients.forEach((ingredient, i) => {
          if (ingredient.includes(token)) {
            score += 20
            hit = true
            matchedIngredients.add(recipe.ingredients[i])
          }
        })
        if (description.includes(token)) (score += 10), (hit = true)
        return hit
      })

      return allMatch ? { recipe, score, matchedIngredients } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

// Bold every query word inside `text`.
function Highlight({ text, tokens }) {
  if (!text || !tokens.length) return text || null
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi')
  return text.split(pattern).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-caramel-900">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

Highlight.propTypes = {
  text: PropTypes.string,
  tokens: PropTypes.array,
}

// Description excerpt around the first match, or the matching ingredients.
function snippetFor({ recipe, matchedIngredients }, tokens) {
  const description = recipe.description || ''
  const lower = normalize(description)
  const at = Math.min(
    ...tokens.map((t) => lower.indexOf(t)).filter((i) => i >= 0),
    Infinity
  )
  if (at !== Infinity) {
    const start = Math.max(0, at - 40)
    return `${start ? '…' : ''}${description.slice(start).replace(/\s+/g, ' ')}`
  }
  if (matchedIngredients.size) {
    return `With ${[...matchedIngredients].join(', ')}`
  }
  return description.replace(/\s+/g, ' ')
}

function SearchModal({ open, onClose }) {
  const router = useRouter()
  const inputRef = useRef(null)
  const [index, setIndex] = useState(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!open) return undefined
    loadIndex().then(setIndex)
    setQuery('')
    setActive(0)
    requestAnimationFrame(() => inputRef.current?.focus())
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  // Close on navigation (e.g. picking a result).
  useEffect(() => {
    router.events.on('routeChangeStart', onClose)
    return () => router.events.off('routeChangeStart', onClose)
  }, [router.events, onClose])

  const tokens = useMemo(
    () => normalize(query).split(/\s+/).filter(Boolean),
    [query]
  )
  const results = useMemo(
    () => (index ? search(index, query) : []),
    [index, query]
  )

  if (!open) return null

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && results[active]) {
      router.push(`/${results[active].recipe.slug}`)
    }
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center bg-caramel-900/40 px-4 pt-[8vh] md:pt-16 font-sans"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search recipes"
          className="w-full max-w-xl rounded-xl bg-white shadow-2xl overflow-hidden"
        >
          <div className="p-3 border-b border-caramel-200">
            <label className="flex items-center gap-2 rounded-lg border-2 border-caramel-500 px-3 py-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-caramel-500 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={onKeyDown}
                placeholder="Search recipes or ingredients"
                aria-label="Search recipes or ingredients"
                className="flex-1 min-w-0 bg-transparent text-base text-caramel-900 placeholder-caramel-400 outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  className="text-sm text-caramel-500 hover:text-caramel-900"
                >
                  Clear
                </button>
              )}
            </label>
          </div>

          <ul className="max-h-[65vh] overflow-y-auto p-3 space-y-2">
            {query && index && !results.length && (
              <li className="px-2 py-6 text-center text-sm text-caramel-500">
                No recipes match “{query}”.
              </li>
            )}
            {query && !index && (
              <li className="px-2 py-6 text-center text-sm text-caramel-500">
                Loading…
              </li>
            )}
            {results.map((result, i) => (
              <li key={result.recipe._id}>
                <Link
                  href={`/${result.recipe.slug}`}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors duration-75 ${
                    i === active
                      ? 'border-caramel-300 bg-caramel-100'
                      : 'border-caramel-200'
                  }`}
                >
                  {result.recipe.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.recipe.thumb}
                      alt=""
                      width="64"
                      height="64"
                      className="w-16 h-12 rounded object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-16 h-12 rounded bg-caramel-150 shrink-0" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-medium text-caramel-900 truncate">
                      <Highlight text={result.recipe.title} tokens={tokens} />
                    </span>
                    <span className="block text-sm text-caramel-700 truncate">
                      <Highlight
                        text={snippetFor(result, tokens)}
                        tokens={tokens}
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Portal>
  )
}

SearchModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

export default SearchModal
