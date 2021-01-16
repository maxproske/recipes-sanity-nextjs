import React from 'react'
import PropTypes from 'prop-types'

function Banner({ children, category, description }) {
  return (
    <div className="banner pt-12 px-4 py-4 md:px-4 md:py-24 flex flex-col items-center justify-center border-b border-caramel-200 overflow-hidden relative">
      <div className="max-w-4xl relative">
        <div className="flex flex-col items-center justify-center relative">
          <div
            className="bg-white absolute inset-0 top-auto"
            style={{ height: `70%` }}
          />
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-display font-black uppercase tracking-mega text-caramel-800 text-center relative">
            {children}
          </h1>
        </div>
        <div className="bg-white pb-6 md:pb-12 px-6 md:px-12 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 border border-caramel-300 m-2 md:m-4" />
          {category && (
            <div className="my-6 md:my-12 flex items-center">
              <div className="w-6 md:w-12 border-t border-caramel-300" />
              <div className="px-3 font-display uppercase tracking-widest text-xs leading-none text-caramel-500">
                {category}
              </div>
              <div className="w-6 md:w-12 border-t border-caramel-300" />
            </div>
          )}
          {description && (
            <div className="md:text-lg md:leading-relaxed font-serif italic text-caramel-800 max-w-xl text-center">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Banner.propTypes = {
  children: PropTypes.node,
  category: PropTypes.string,
  description: PropTypes.string,
}

export default Banner
