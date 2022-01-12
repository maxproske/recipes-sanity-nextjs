import React from 'react'
import PropTypes from 'prop-types'

import Count from './Count'
import {PortableText} from '../../lib/sanity'

function Step({ step, count }) {
  return (
    <div className="max-w-2xl mx-auto font-serif text-lg leading-relaxed md:flex">
      <Count count={count} />
      <div className="prose text-caramel-800">
        <PortableText blocks={step.step} />
      </div>
    </div>
  )
}

Step.propTypes = {
  step: PropTypes.object,
  count: PropTypes.number,
}

export default Step
