import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { categoryIcons } from './categoryIcons'

// Line icon per category, keyed by title without the trailing "*" some titles
// carry. Unknown categories fall back to a knife and fork.
const ICON = {
  German: 'sausage',
  Indian: 'pepper',
  'International Recipes': 'bowl-chopsticks',
  Desserts: 'cake',
  'Cookies, Bars & Muffins': 'cookie',
  Brunch: 'croissant',
  'Meat Recipes': 'meat',
  Salads: 'salad',
  Bread: 'bread',
  'Soups & Stews': 'soup',
  'Veggie Recipes': 'carrot',
  'Pasta & Pizza': 'pizza',
  Beverages: 'glass-cocktail',
  'Seafood Recipes': 'fish',
  Appetizers: 'cheese',
  Preserves: 'bottle',
  'Sauces & Dressings': 'ladle',
  Holidays: 'christmas-tree',
}

// One-word captions so every chip fits the same fixed width.
const LABEL = {
  'International Recipes': 'International',
  'Cookies, Bars & Muffins': 'Cookies',
  'Meat Recipes': 'Meat',
  'Soups & Stews': 'Soups',
  'Veggie Recipes': 'Veggie',
  'Pasta & Pizza': 'Pasta',
  'Seafood Recipes': 'Seafood',
  'Sauces & Dressings': 'Sauces',
}

// Pinned to the front of the strip, in this order; the rest follow by size.
const PINNED = ['German', 'Indian']

// A trailing "*" marks a category as approved in the Studio — editor-only, so
// it's stripped everywhere on the site.
export const cleanCategoryTitle = (title = '') => title.replace(/\*+$/, '').trim()

// Display label for a recipe's categories, e.g. "Desserts · Indian".
export const categoriesLabel = (categories = []) =>
  (categories || [])
    .filter(Boolean)
    .map((category) => cleanCategoryTitle(category.title))
    .join(' · ')

export const categorySlug = (title = '') =>
  cleanCategoryTitle(title)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function Icon({ name }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9"
      aria-hidden="true"
      // Static, trusted markup from categoryIcons.js.
      dangerouslySetInnerHTML={{
        __html: categoryIcons[name] || categoryIcons['tools-kitchen-2'],
      }}
    />
  )
}

Icon.propTypes = {
  name: PropTypes.string,
}

function Chip({ href, active, icon, label, shallow }) {
  return (
    <Link
      href={href}
      scroll={false}
      shallow={shallow}
      aria-current={active ? 'page' : undefined}
      className="group relative shrink-0 snap-start w-20 flex flex-col items-center gap-1 px-1 pt-3 pb-3 text-caramel-900 focus:outline-none focus-visible:bg-caramel-200"
    >
      <span className="transition-transform duration-150 group-hover:-translate-y-0.5">
        <Icon name={icon} />
      </span>
      <span className="max-w-full truncate text-[13px] leading-tight">
        {label}
      </span>
      <span
        className={`absolute bottom-0 left-3 right-3 h-[3px] bg-caramel-700 transition-opacity duration-150 ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
    </Link>
  )
}

Chip.propTypes = {
  href: PropTypes.string,
  active: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  shallow: PropTypes.bool,
}

function CategoryChips({ categories, activeSlug }) {
  if (!categories?.length) return null

  // On the homepage (activeSlug !== undefined) the recipes are already loaded,
  // so only swap the query string — no getStaticProps round trip.
  const shallow = activeSlug !== undefined

  const pinRank = (category) => {
    const i = PINNED.indexOf(cleanCategoryTitle(category.title))
    return i === -1 ? PINNED.length : i
  }
  // Stable sort keeps the query's biggest-first order behind the pinned ones.
  const ordered = [...categories].sort((a, b) => pinRank(a) - pinRank(b))

  return (
    <nav aria-label="Recipe categories" className="bg-caramel-150 font-sans">
      {/* One swipeable row; w-max + mx-auto centres it when it all fits. */}
      <div className="overflow-x-auto snap-x [scrollbar-width:none]">
        <div className="flex w-max mx-auto px-2">
          <Chip
            href="/"
            active={activeSlug === null}
            icon="book-2"
            label="All"
            shallow={shallow}
          />
          {ordered.map((category) => {
            const title = cleanCategoryTitle(category.title)
            const slug = categorySlug(category.title)
            return (
              <Chip
                key={category._id}
                href={`/?category=${slug}`}
                active={activeSlug === slug}
                icon={ICON[title]}
                label={LABEL[title] || title}
                shallow={shallow}
              />
            )
          })}
        </div>
      </div>
    </nav>
  )
}

CategoryChips.propTypes = {
  categories: PropTypes.array,
  // null = "All" is active (homepage, no filter); undefined = nothing active.
  activeSlug: PropTypes.string,
}

export default CategoryChips
