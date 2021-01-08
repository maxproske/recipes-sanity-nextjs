import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Portal } from 'react-portal'
import { InformationCircleSolid } from '@graywolfai/react-heroicons'

import { units } from '../../../studio/schemas/components/amountSettings'
import { useStore } from '../../hooks/useStore'
import IngredientModal from './IngredientModal'
import { convertCups, filterAmounts, valueFraction } from './amountHelpers'

function hasModalContent(ingredient) {
  const { alternativeNames } = ingredient

  return alternativeNames && alternativeNames.length > 0
}

function Amount({ ingredient }) {
  const [openModal, setOpenModal] = useState(false)

  const { amount, note } = ingredient
  const { unit, amounts } = amount
  const { cupInGrams } = ingredient.ingredient

  const cup = useStore((state) => state.cup)
  const serves = useStore((state) => state.serves)
  const standard = useStore((state) => state.standard)

  //
  const amountBase = {
    ...amount,
    ...units[amount.unit],
  }

  // Get all amounts and update values for serves
  const displayAmounts = amounts.map((item) => ({
    ...item, // Item base
    value: item.value * serves, // Update value client-side for serves
    ...units[item.unit], // Get unit title/plural
  }))

  let displayAmount = {}

  if (displayAmounts.length > 0) {
    // Show converted amounts depending on state
    if (
      amountBase.standard === 'Imperial' ||
      amountBase.standard === 'Metric'
    ) {
      displayAmount = filterAmounts(displayAmounts, { standard })
    } else if (
      amountBase.standard === 'Traditional' &&
      amountBase.unit === 'cup'
    ) {
      switch (cup) {
        case 'Cups':
          displayAmount = filterAmounts(displayAmounts, { unit: 'cup' })
          break

        case 'Volume':
        case 'Weight':
          displayAmount = filterAmounts(displayAmounts, { standard, type: cup })

          // Only volume unit details come along, we need to add weight unit details
          if (cup === 'Weight') {
            displayAmount = {
              ...displayAmount,
              ...units[standard === 'Imperial' ? 'oz' : 'g'],
            }
          }

          // Dynamically create weight / volume
          if (cupInGrams) {
            displayAmount = {
              ...displayAmount,
              ...convertCups(
                amountBase.value * serves,
                cupInGrams,
                cup,
                standard
              ),
            }
          }
          break

        default:
          displayAmount = filterAmounts(displayAmounts, { unit: 'cup' })

          break
      }
    } else {
      const [displayAmountsFirst] = displayAmounts
      displayAmount = displayAmountsFirst
    }
  } else {
    // Fallback to initial value
    displayAmount = { ...amount }
  }

  // Does the amount have decimals?
  if (
    displayAmount &&
    displayAmount.standard === 'Traditional' &&
    displayAmount.value % 1 > 0
  ) {
    if (cup === 'Cups' || (cup !== 'Cups' && unit !== 'Cup')) {
      displayAmount.valueFraction = valueFraction(displayAmount.value)
    }
  }

  // Clean up
  if (displayAmount && displayAmount.single === 'Quantity') {
    displayAmount.single = ''
  }

  return (
    <span className="w-full inline-flex group relative py-1">
      <span className="hidden sm:inline text-caramel-400 pr-1 text-lg leading-none">
        •
      </span>
      <span className="flex-1">
        {displayAmount && (
          <span className="font-mono text-xs text-caramel-700 whitespace-nowrap">
            {displayAmount.value && !displayAmount.valueFraction
              ? parseFloat(displayAmount.value.toFixed())
              : displayAmount.valueFraction}
            {` `}
            {displayAmount.value > 1 && displayAmount.plural
              ? displayAmount.plural
              : displayAmount.single}
            {` `}
          </span>
        )}
        <span className="text-sm font-serif text-caramel-900 group-hover:text-caramel-700">
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
      {hasModalContent(ingredient.ingredient) && (
        <>
          <button
            className="ml-auto opacity-10 group-hover:opacity-100 transition-opacity duration-100 pl-2"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            <span className="absolute inset-0" />
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
        </>
      )}
    </span>
  )
}

export default Amount
