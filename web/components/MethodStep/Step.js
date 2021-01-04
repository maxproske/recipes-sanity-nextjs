import React from 'react'
import PropTypes from 'prop-types'
import PortableText from '../PortableText'
import Count from './Count'

function Step({ step, count }) {
  return (
    <div className="max-w-2xl mx-auto font-serif text-lg leading-relaxed md:flex">
      <Count count={count} />
      <PortableText blocks={step.step} />
    </div>
  )
}

Step.propTypes = {
  step: PropTypes.object,
  count: PropTypes.number,
}

export default Step
