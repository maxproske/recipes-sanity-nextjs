import React from 'react'
import PropTypes from 'prop-types'

import { useCheckable } from '../../hooks/useChecklist'

// Tap a method step to mark it done; it fades so the next step stands out.
function CheckableStep({ stepKey, className = '', children }) {
  const { isChecked, props } = useCheckable(stepKey)

  return (
    <div
      {...props}
      className={`${className} cursor-pointer transition-opacity duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel-400 ${
        isChecked ? 'opacity-40' : ''
      }`}
    >
      {children}
    </div>
  )
}

CheckableStep.propTypes = {
  stepKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default CheckableStep
