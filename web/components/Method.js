import React from 'react'
import PropTypes from 'prop-types'
import Component from './MethodStep/Component'
import Step from './MethodStep/Step'
import Title from './MethodStep/Title'
import CheckableStep from './MethodStep/CheckableStep'
import Heading from './Heading'

function Method({ method, ingredientSets }) {
  if (!method?.length || !ingredientSets?.length) {
    return null
  }

  let methodCount = 0

  return (
    <>
      <Heading>Method</Heading>

      {method.map((step) => {
        if (step._type === 'title') {
          return (
            <div key={step._key}>
              <Title step={step} />
            </div>
          )
        }

        methodCount += 1

        return (
          <CheckableStep
            key={step._key}
            stepKey={step._key}
            className="mb-8 md:mb-16"
          >
            {step._type === 'component' && (
              <Component
                allIngredients={ingredientSets}
                count={methodCount}
                step={step}
              />
            )}
            {step._type === 'step' && <Step count={methodCount} step={step} />}
          </CheckableStep>
        )
      })}
    </>
  )
}

Method.propTypes = {
  method: PropTypes.array,
  ingredientSets: PropTypes.array,
}

export default Method
