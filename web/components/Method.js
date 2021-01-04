import React from 'react'
import PropTypes from 'prop-types'
import Component from './MethodStep/Component'
import Step from './MethodStep/Step'
import Title from './MethodStep/Title'
import Heading from './Heading'

function Method({ method, ingredients }) {
  let methodCount = 0

  return (
    <>
      <Heading>Method</Heading>

      {method.map((step) => {
        if (step._type !== 'title') methodCount += 1

        return (
          <div
            key={step._key}
            className={step._type !== 'title' ? `mb-8 md:mb-16` : ``}
          >
            {step._type === 'title' && <Title step={step} />}
            {step._type === 'component' && (
              <Component
                allIngredients={ingredients}
                count={methodCount}
                step={step}
              />
            )}
            {step._type === 'step' && <Step count={methodCount} step={step} />}
          </div>
        )
      })}
    </>
  )
}

Method.propTypes = {
  method: PropTypes.array,
  ingredients: PropTypes.array,
}

export default Method
