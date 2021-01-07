import React, { useRef, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withDocument } from 'part:@sanity/form-builder'

// Important items to allow form fields to work properly and patch the dataset.
import FormField from 'part:@sanity/components/formfields/default'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'

import { TextInput, Stack, Flex, Radio, Label, Select } from '@sanity/ui'
import { getUnitDetails, options, units } from './amountSettings'

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
  const [settings, setSettings] = useState(initialOptions)
  const unitsRef = useRef()

  // Local state
  const [localValue, setLocalValue] = useState(
    props.value ? { ...props.value } : {}
  )

  // Handle value + unit changes
  // Update local state and create Patch event
  const handleChange = (newValue, newStandardAndUnit) => {
    let updatedValue = { ...localValue }

    // Update value
    if (newValue === '') {
      updatedValue.value = ''
    } else {
      updatedValue.value = newValue
        ? parseFloat(newValue)
        : parseFloat(updatedValue.value)
    }

    // Update units
    const unitsString =
      newStandardAndUnit && newStandardAndUnit.includes('.')
        ? newStandardAndUnit
        : unitsRef.current.value
    const [newStandard, newType] = unitsString.split('.')

    updatedValue.standard = newStandard
    updatedValue.unit = newType

    // Use our updated values and current settings...
    const { value, unit, standard } = updatedValue

    // Add details about unit
    updatedValue = { ...updatedValue, ...getUnitDetails(newStandard, unit) }

    // ...to create converted amounts
    updatedValue.amounts = !value ? [] : convertedAmounts(value, unit, standard)

    setLocalValue(updatedValue)
    onChange(createPatchFrom(updatedValue))
  }

  // Create initial conversions for new fields
  useEffect(() => {
    if (localValue.amounts && localValue.amounts.length === 0) {
      handleChange()
    }
  }, [])

  // When Radio buttons are used
  const changeSetting = (key, newSetting) => {
    // Update 'settings'
    const currentSettings = { ...settings, [key]: newSetting }

    setSettings(currentSettings)
  }

  // Called by the Sanity form-builder when this input should receive focus
  //   focus = () => {
  //     valueRef.current.focus()
  //   }

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
        >
          {Object.keys(units).map((unitKey) => (
            <optgroup key={`option-${unitKey}`} label={unitKey}>
              {units[unitKey].map((option) => (
                <option
                  key={`${unitKey}.${option.value}`}
                  value={`${unitKey}.${option.value}`}
                >
                  {option.titlePlural && localValue.value !== 1
                    ? option.titlePlural
                    : option.title}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </Flex>

      {/* <Flex style={{ gap: `2rem`, padding: `1rem 0` }}>
        {options.map((option) => (
          <Stack space={3} key={option.title}>
            <Label size={1}>{option.title}</Label>
            <Flex>
              {option.options.map((subOption) => {
                const optionId = `${option.title}-${subOption}`.toLowerCase()

                return (
                  <div key={optionId}>
                    <label
                      htmlFor={optionId}
                      style={{
                        display: `flex`,
                        alignItems: `center`,
                        paddingRight: `1rem`,
                      }}
                    >
                      <Radio
                        id={optionId}
                        checked={settings[option.title] === subOption}
                        onChange={() => changeSetting(option.title, subOption)}
                        name={option.title}
                        value={subOption}
                        style={{ marginRight: `.25rem` }}
                      />
                      {subOption}
                    </label>
                  </div>
                )
              })}
            </Flex>
          </Stack>
        ))}
      </Flex> */}

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
                {item.unitTitlePlural && item.value !== 1
                  ? item.unitTitlePlural
                  : item.unitTitle}
              </div>
            ))}
          </Flex>
        </>
      )}

      {/* <div style={{ display: 'flex', alignItems: `center` }}>
        {localValue && (
          <pre
            style={{
              padding: '1rem',
              marginRight: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#efefef',
              width: '100%',
              fontSize: '12px',
            }}
          >
            {JSON.stringify(localValue, undefined, `  `)}
          </pre>
        )}
      </div> */}
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
