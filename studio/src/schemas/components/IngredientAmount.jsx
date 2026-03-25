import React, { useState, useEffect, useCallback } from 'react'
import { set } from 'sanity'
import { TextInput, Flex, Label, Select, Stack, Text } from '@sanity/ui'
import { units, unitDropdown } from './amountSettings'
import convertedAmounts from './convertedAmounts'

export default function IngredientAmount(props) {
  const { value, onChange } = props

  const [localValue, setLocalValue] = useState(
    value ? { ...value } : { unit: 'cup' }
  )

  const handleChange = useCallback(
    (newValue, newUnit) => {
      const updatedValue = { ...localValue }

      if (newValue === '') {
        updatedValue.value = ''
      } else {
        updatedValue.value = newValue
          ? parseFloat(newValue)
          : parseFloat(updatedValue.value)
      }

      if (newUnit) {
        updatedValue.unit = newUnit
      }

      const { value: val, unit } = updatedValue
      updatedValue.amounts = !val ? [] : convertedAmounts(val, unit)

      setLocalValue(updatedValue)
      onChange(set(updatedValue))
    },
    [localValue, onChange]
  )

  // Create initial conversions for new fields
  useEffect(() => {
    if (localValue.amounts && localValue.amounts.length === 0) {
      handleChange()
    }
  }, [])

  const dropdown = unitDropdown()

  return (
    <Stack space={3}>
      <Flex gap={3}>
        <TextInput
          type="number"
          value={localValue.value}
          onChange={(event) => handleChange(event.target.value)}
        />
        <Select
          onChange={(event) => handleChange(undefined, event.target.value)}
          value={localValue.unit}
        >
          {Object.keys(dropdown).map((unitKey) => (
            <optgroup key={`option-${unitKey}`} label={unitKey}>
              {dropdown[unitKey].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.plural && localValue.value !== 1
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
          <Label size={1}>Converted {localValue.type}</Label>
          <Flex gap={3} align="center">
            {localValue.amounts.map((item) => (
              <Text
                key={`converted-${item.standard}-${item.unit}`}
                size={1}
              >
                {item.value}{' '}
                {units[item.unit]
                  ? units[item.unit].plural && item.value !== 1
                    ? units[item.unit].plural
                    : units[item.unit].single
                  : 'No label'}
              </Text>
            ))}
          </Flex>
        </>
      )}
    </Stack>
  )
}
