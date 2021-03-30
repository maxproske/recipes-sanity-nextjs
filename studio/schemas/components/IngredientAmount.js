import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withDocument } from 'part:@sanity/form-builder'

// Important items to allow form fields to work properly and patch the dataset.
import FormField from 'part:@sanity/components/formfields/default'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'

import { TextInput, Flex, Label, Select } from '@sanity/ui'
import { options, units, unitDropdown } from './amountSettings'

// Import the TextInput from UI
import convertedAmounts from './convertedAmounts'

// 4. Create a Sanity PatchEvent based on a change in time value
const createPatchFrom = (value) =>
  PatchEvent.from(value === {} ? unset() : set(value))

const IngredientAmount = React.forwardRef((props, ref) => {
  const { type, onChange } = props

  // Create local state to control Radio buttons
  const initialOptions = {}
  options.forEach(
    (option) => (initialOptions[option.title] = option.options[0])
  )
  const unitsRef = useRef()

  // Local state
  const [localValue, setLocalValue] = useState(
    props.value ? { ...props.value } : { unit: 'cup' }
  )

  // Handle value + unit changes
  // Update local state and create Patch event
  const handleChange = (newValue, newUnit) => {
    const updatedValue = { ...localValue }

    // Update value
    if (newValue === '') {
      updatedValue.value = ''
    } else {
      updatedValue.value = newValue
        ? parseFloat(newValue)
        : parseFloat(updatedValue.value)
    }

    // Update units
    if (newUnit) {
      updatedValue.unit = newUnit
    }

    // Use our updated values and current settings...
    const { value, unit } = updatedValue

    // ...to create converted amounts
    updatedValue.amounts = !value ? [] : convertedAmounts(value, unit)

    setLocalValue(updatedValue)
    onChange(createPatchFrom(updatedValue))
  }

  // Create initial conversions for new fields
  useEffect(() => {
    if (localValue.amounts && localValue.amounts.length === 0) {
      handleChange()
    }
  }, [])

  return (
    <FormField label={type.title} description={type.description}>
      <Flex style={{ gap: `1rem` }}>
        <TextInput
          ref={ref}
          style={{
            backgroundColor: `white`,
            border: `1px solid #cad1dc`,
            borderRadius: `2px`,
          }}
          type="number"
          value={localValue.value}
          onChange={(event) => handleChange(event.target.value)}
        />
        <Select
          style={{
            backgroundColor: `white`,
            border: `1px solid #cad1dc`,
            borderRadius: `2px`,
          }}
          ref={unitsRef}
          onChange={(event) => handleChange(undefined, event.target.value)}
          value={localValue.unit}
        >
          {Object.keys(unitDropdown()).map((unitKey) => (
            <optgroup key={`option-${unitKey}`} label={unitKey}>
              {unitDropdown()[unitKey].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.plural && localValue.value > 1
                    ? option.plural
                    : option.single}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </Flex>

      {localValue.amounts && localValue.amounts.length > 0 && (
        <>
          <Label
            style={{
              marginTop: `1rem`,
            }}
            size={1}
          >
            Converted {localValue.type}
          </Label>
          <Flex
            style={{
              marginTop: `0.5rem`,
              alignItems: `center`,
            }}
          >
            {localValue.amounts.map((item) => (
              <div
                key={`converted-${item.standard}-${item.unit}`}
                style={{ paddingRight: `1rem` }}
              >
                {item.value}{' '}
                {units[item.unit]
                  ? units[item.unit].plural && item.value > 1
                    ? units[item.unit].plural
                    : units[item.unit].single
                  : `No label`}
              </div>
            ))}
          </Flex>
        </>
      )}
    </FormField>
  )
})

export default withDocument(IngredientAmount)

IngredientAmount.displayName = 'IngredientAmount'

IngredientAmount.propTypes = {
  type: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  value: PropTypes.object,
  //   document: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}
