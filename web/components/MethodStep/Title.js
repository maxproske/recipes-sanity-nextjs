import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../Heading'

function Title({ step }) {
  return (
    <Heading className="mt-8" as="h3">
      {step.title}
    </Heading>
  )
}

Title.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string,
  }),
}

export default Title
