import React from 'react'
import PropTypes from 'prop-types'

import Amount from './Ingredient/Amount'
import Heading from './Heading'
import { useChecklist, useCheckable } from '../hooks/useChecklist'

// The amount renders inside inline-flex spans, which text-decoration doesn't
// propagate into, so strike the spans directly.
export const checkedClasses = '[&_span]:line-through opacity-40'

export function CheckableIngredient({ ingredient, className = '', dot }) {
  const { isChecked, props } = useCheckable(ingredient._key)

  return (
    <li
      {...props}
      className={`${className} cursor-pointer select-none transition-opacity duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel-400 ${
        isChecked ? checkedClasses : ''
      }`}
    >
      <Amount dot={dot} ingredient={ingredient} />
    </li>
  )
}

CheckableIngredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  className: PropTypes.string,
  dot: PropTypes.bool,
}

function Ingredients({ ingredientSets }) {
  const hasChecks = useChecklist(
    (state) => Object.keys(state.checked).length > 0
  )
  const clear = useChecklist((state) => state.clear)

  if (!ingredientSets?.length) {
    return null
  }

  return (
    <>
      <div className="flex items-baseline justify-between">
        <Heading>Ingredients</Heading>
        {hasChecks ? (
          <button
            type="button"
            onClick={clear}
            className="label text-caramel-500 hover:text-caramel-700"
          >
            Clear ticks
          </button>
        ) : (
          <span className="label text-caramel-400">Tap to tick off</span>
        )}
      </div>
      <div className="divide-x divide-caramel-200 sm:flex pb-2 mt-6 mb-12 -mx-4">
        {ingredientSets.map((set) => (
          <div key={set._key} className="px-4 mb-8 sm:mb-0 flex-1">
            <Heading as="h3">{set.title}</Heading>
            <ul
              className={`text-sm grid gap-x-4 grid-cols-2 ${
                ingredientSets.length === 1
                  ? `sm:grid-cols-3`
                  : `sm:gap-0 sm:grid-cols-1`
              } `}
            >
              {set.ingredients.map((ingredient) => (
                <CheckableIngredient
                  key={ingredient._key}
                  ingredient={ingredient}
                  className="py-1 border-b border-caramel-200"
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

Ingredients.propTypes = {
  ingredientSets: PropTypes.array,
}

export default Ingredients
