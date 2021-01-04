import React from 'react'
import PropTypes from 'prop-types'

function Count({ count }) {
  return (
    <span className="text-caramel-500 font-display font-black text-5xl md:text-6xl pr-2 md:pr-4 float-left md:float-none">
      {count}
    </span>
  )
}

Count.propTypes = {
  count: PropTypes.number.isRequired,
}

export default Count
