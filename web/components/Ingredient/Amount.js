import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Portal } from 'react-portal'
import { InformationCircleSolid } from '@graywolfai/react-heroicons'

import { useStore } from '../../hooks/useStore'
import IngredientModal from './IngredientModal'

const convert = require('convert-units')

function Amount({ ingredient }) {
  const [openModal, setOpenModal] = useState(false)

  const { amount, note, measurement } = ingredient
  const { cupInGrams } = ingredient.ingredient

  const cup = useStore((state) => state.cup)
  const serves = useStore((state) => state.serves)
  const weight = useStore((state) => state.weight)

  let amountDisplay
  let measurementDisplay = measurement

  if (amount && typeof amount === 'number') {
    let amountBase = amount

    // Cups to something else
    if (measurementDisplay === 'Cup' && cup !== 'Cups' && cupInGrams) {
      if (cup === 'Weight') {
        if (weight === 'Metric') {
          measurementDisplay = 'Grams'
          amountBase = cupInGrams * amount
        }

        if (weight === 'Imperial') {
          measurementDisplay = 'Oz'
          amountBase = convert(cupInGrams * amount)
            .from('g')
            .to('oz')
        }
      }

      if (cup === 'Volume') {
        if (weight === 'Metric') {
          measurementDisplay = 'mL'
          amountBase = amount * 250 // 250mL per cup
        }

        if (weight === 'Imperial') {
          measurementDisplay = 'fl oz'
          amountBase = amount * 8.32674 // fluid oz per cup
        }
      }
    }

    // Oz to Grams
    if (measurement === 'Oz' && weight === 'Metric') {
      measurementDisplay = 'Grams'
      amountBase = convert(amount).from('oz').to('g')
    } else if (measurement === 'grams' && weight === 'Imperial') {
      measurementDisplay = 'Oz'
      amountBase = convert(amount).from('g').to('oz')
    } else if (measurement === 'ml' && weight === 'Imperial') {
      measurementDisplay = 'fl oz'
      amountBase = convert(amount).from('ml').to('fl-oz')
    }

    amountDisplay = amountBase * serves

    // Does the amount have decimals?
    if (amountDisplay % 1 > 0) {
      amountDisplay = amountDisplay.toFixed(2)

      if (cup === 'Cups' || (cup !== 'Cups' && measurement !== 'Cup')) {
        const amountEnd = amountDisplay.split('.').pop()

        switch (amountEnd) {
          case '25':
            amountDisplay = amountDisplay.replace('.25', `¼`)
            break
          case '33':
            amountDisplay = amountDisplay.replace('.33', `⅓`)
            break
          case '50':
            amountDisplay = amountDisplay.replace('.50', `½`)
            break
          case '66':
            amountDisplay = amountDisplay.replace('.66', `⅔`)
            break
          case '75':
            amountDisplay = amountDisplay.replace('.75', `¾`)
            break
          default:
            break
        }

        // Get rid of any leading zero
        if (amountDisplay[0] === '0') {
          amountDisplay = amountDisplay.slice(1)
        }
      }
    }
  }

  // Check for plurals, this should be more optimised
  if (amountDisplay > 1 && measurementDisplay === 'Cup') {
    measurementDisplay = 'Cups'
  }

  return (
    <span className="inline-flex group">
      <span className="flex-1">
        <span className="font-mono text-xs text-caramel-700 whitespace-nowrap">
          {amountDisplay}
          {` `}
          {measurementDisplay}
          {` `}
        </span>
        <span className="text-sm font-serif text-caramel-900">
          {note ? (
            <>
              {ingredient.ingredient.title}
              <br />
              <span className="text-caramel-500 italic">{note}</span>
            </>
          ) : (
            ingredient.ingredient.title
          )}
        </span>
      </span>
      <button
        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-100 pl-1"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        <InformationCircleSolid className="w-4 h-auto text-caramel-500" />
      </button>
      {openModal && (
        <Portal>
          <IngredientModal
            ingredient={ingredient.ingredient}
            close={() => setOpenModal(false)}
          />
        </Portal>
      )}
    </span>
  )
}

Amount.propTypes = {
  ingredient: PropTypes.object,
}

export default Amount
