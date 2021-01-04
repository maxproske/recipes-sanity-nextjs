import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../Heading'

function IngredientModal({ ingredient, close }) {
  const { alternativeNames, title } = ingredient
  return (
    <div className="inset-0 fixed bg-caramel-900 bg-opacity-90 p-4 md:p-12 flex justify-center items-start">
      <button
        className="absolute w-full h-full inset-0"
        type="button"
        onClick={() => close()}
      >
        <span className="sr-only">Close</span>
      </button>
      <div className="bg-white p-4 md:p-12 max-w-xl w-full relative shadow-lg">
        <Heading>{title}</Heading>
        {alternativeNames && alternativeNames.length > 0 && (
          <div className="pt-4 border-t border-dashed border-caramel-300">
            <Heading as="h3">Alternative Names</Heading>
            <ul className="font-serif space-y-2 pr-4 mb-2">
              {alternativeNames.map((name) => (
                <li key={name}>
                  <span className="hidden sm:inline text-caramel-400 pr-1 text-lg leading-none">
                    •
                  </span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-dashed border-caramel-300 text-right">
          <button
            className="text-2xs font-display font-black uppercase tracking-widest"
            type="button"
            onClick={() => close()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

IngredientModal.propTypes = {
  ingredient: PropTypes.object,
  close: PropTypes.func,
}

export default IngredientModal
