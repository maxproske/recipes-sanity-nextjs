import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Portal } from 'react-portal'
import { InformationCircleSolid } from '@graywolfai/react-heroicons'

import { useStore } from '../../hooks/useStore'
import IngredientModal from './IngredientModal'
import { convertCups } from './amountHelpers'

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

  // Get all amounts and update values for serves
  const displayAmounts = amounts.map((item) => ({
    ...item,
    value: item.value * serves,
  }))

  let displayAmount = {}

  // Show converted amounts depending on state
  if (
    standard !== 'Traditional' &&
    unit !== 'cup' &&
    displayAmounts.length > 0
  ) {
    displayAmount = displayAmounts.filter(
      (amountsItem) => amountsItem.standard && amountsItem.standard === standard
    )[0]
  } else if (displayAmounts.length > 0) {
    // "Traditional" should just use first amount?
    displayAmount = displayAmounts[0]

    // Cups to something else
  } else {
    // Fallback to initial value
    displayAmount = { ...amount }
  }

  // Modify 'cups'
  if (unit === 'cup' && cup !== 'Cups' && cupInGrams) {
    displayAmount = {
      ...displayAmount,
      ...convertCups(displayAmount.value, cupInGrams, cup, standard),
    }
  }

  // Does the amount have decimals?
  if (
    displayAmount &&
    displayAmount.standard === 'Traditional' &&
    displayAmount.value % 1 > 0
  ) {
    displayAmount.value = displayAmount.value.toFixed(2)

    if (cup === 'Cups' || (cup !== 'Cups' && unit !== 'Cup')) {
      const amountEnd = displayAmount.value.split('.').pop()

      switch (amountEnd) {
        case '25':
          displayAmount.value = displayAmount.value.replace('.25', `¼`)
          break
        case '33':
          displayAmount.value = displayAmount.value.replace('.33', `⅓`)
          break
        case '50':
          displayAmount.value = displayAmount.value.replace('.50', `½`)
          break
        case '66':
          displayAmount.value = displayAmount.value.replace('.66', `⅔`)
          break
        case '75':
          displayAmount.value = displayAmount.value.replace('.75', `¾`)
          break
        default:
          break
      }

      // Get rid of any leading zero
      if (displayAmount.value[0] === '0') {
        displayAmount.value = displayAmount.value.slice(1)
      }
    }
  }

  // Clean up
  if (displayAmount && displayAmount.unitTitle === 'Quantity') {
    displayAmount.unitTitle = ''
  }

  return (
    <span className="w-full inline-flex group relative py-1">
      <span className="hidden sm:inline text-caramel-400 pr-1 text-lg leading-none">
        •
      </span>
      <span className="flex-1">
        {displayAmount && (
          <span className="font-mono text-xs text-caramel-700 whitespace-nowrap">
            {displayAmount.value}
            {` `}
            {displayAmount.value > 1 && displayAmount.unitTitlePlural
              ? displayAmount.unitTitlePlural
              : displayAmount.unitTitle}
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

Amount.propTypes = {
  ingredient: PropTypes.shape({
    amount: PropTypes.shape({
      amounts: PropTypes.array,
      type: PropTypes.string,
      unit: PropTypes.string,
    }),
    ingredient: PropTypes.shape({
      cupInGrams: PropTypes.number,
      title: PropTypes.string,
    }),
    note: PropTypes.string,
  }),
}

export default Amount
