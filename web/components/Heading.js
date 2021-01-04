import React from 'react'
import PropTypes from 'prop-types'

function Heading({ className = '', children, as = 'h2' }) {
  const classes = `text-caramel-800 font-display font-black uppercase mb-4 tracking-widest`

  if (as === 'h3') {
    return <h3 className={`${classes} text-sm ${className}`}>{children}</h3>
  }

  if (as === 'h1') {
    return <h1 className={`${classes} text-2xl ${className}`}>{children}</h1>
  }

  return <h2 className={`${classes} text-xl ${className}`}>{children}</h2>
}

Heading.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.string,
}

export default Heading
