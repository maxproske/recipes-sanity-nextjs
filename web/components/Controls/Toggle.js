import React from 'react'
import PropTypes from 'prop-types'

function Toggle({ name, options, current, changeFunction }) {
  return (
    <div className="ml-auto flex justify-end px-1">
      {options.map((option) => (
        <button
          key={
            typeof option === 'string'
              ? `${name}-${option}`
              : `${name}-${option.value}`
          }
          type="button"
          onClick={() =>
            changeFunction(typeof option === 'string' ? option : option.value)
          }
          className={`uppercase text-2xs font-black tracking-widest my-1 py-4 md:py-2 px-2 leading-none transition-colors duration-100 
            ${
              option === current || option.value === current
                ? `text-caramel-900`
                : `text-caramel-500 hover:bg-white hover:text-caramel-600`
            }
          `}
        >
          {typeof option === 'string' ? option : option.abbr}
        </button>
      ))}
    </div>
  )
}

Toggle.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  changeFunction: PropTypes.func.isRequired,
}

export default Toggle
