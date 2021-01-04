import React from 'react'
import PropTypes from 'prop-types'

function Banner({ children }) {
  return (
    <div className="banner py-12 md:py-24 flex flex-col items-center justify-center px-4 border-b border-caramel-200 overflow-hidden relative">
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
        <div className="bg-white pb-6 md:pb-12 px-12 flex flex-col items-center justify-center relative">
          <div className="my-6 md:my-12 flex items-center">
            <div className="w-6 md:w-12 border-t-2 border-caramel-200" />
            <div className="px-3 font-display uppercase tracking-widest text-xs leading-none text-caramel-500">
              Desserts
            </div>
            <div className="w-6 md:w-12 border-t-2 border-caramel-200" />
          </div>
          <div className="md:text-lg md:leading-relaxed font-serif italic text-caramel-800 max-w-xl text-center">
            A slightly over-the-top name for what Australians simply refer to as
            "Caramel Slice". Not too complicated to make, but requires a little
            time to let each stage set before applying the next.
          </div>
        </div>
      </div>
    </div>
  )
}

Banner.propTypes = {
  children: PropTypes.node,
}

export default Banner
