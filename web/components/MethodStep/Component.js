import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Amount from '../Ingredient/Amount'
import { PortableText } from '../../lib/sanity'
import Count from './Count'

function Component({ step, count, allIngredients }) {
  const { title, ingredients } = step
  const ingredientsParsed = useMemo(() => {
    try {
      return JSON.parse(ingredients)
    } catch (e) {
      return null
    }
  }, [])

  // Get the full Ingredients info from the keys in this Method Component
  let setIngredients = []
  let componentIngredients = []

  // Oh boy this is a *mess*
  // ...but it works
  Object.keys(ingredientsParsed || {}).forEach((setTitle) => {
    setIngredients = allIngredients.filter((set) => set.title === setTitle)

    if (setIngredients.length > 0) {
      componentIngredients = setIngredients
        .map((ingredientGroup) =>
          ingredientGroup.ingredients.filter(
            (ingredient) => ingredientsParsed[setTitle][ingredient._key]
          )
        )
        .flat()
    }
  })

  // Render component as a Step if missing ingredients
  if (!componentIngredients || componentIngredients.length === 0) {
    return (
      <div className="max-w-2xl mx-auto font-serif text-lg leading-relaxed md:flex">
        <Count count={count} />
        <div className="prose texft-caramel-800">
          <PortableText blocks={step.description} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-4 md:gap-16 items-start justify-start">
      <div className="col-span-2 border-b border-t border-caramel-200 overflow-hidden">
        {title && (
          <p className="py-2 border-b border-dashed border-caramel-300 mb-2 text-xs font-display font-black tracking-widest uppercase text-caramel-500 inline-block">
            {title}
          </p>
        )}
        <ul className="mb-2 text-sm">
          {componentIngredients.map((ingredient) => (
            <li key={ingredient._key}>
              <Amount ingredient={ingredient} />
            </li>
          ))}
        </ul>
      </div>
      <div className="md:flex col-span-3 font-serif text-lg leading-relaxed">
        <Count count={count} />
        <div className="prose text-caramel-800">
          <PortableText blocks={step.description} />
        </div>
      </div>
    </div>
  )
}

Component.propTypes = {
  step: PropTypes.object,
  count: PropTypes.number,
  allIngredients: PropTypes.array,
}

export default Component
