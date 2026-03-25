import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { set, unset, useClient, useFormValue } from 'sanity'
import { Stack, Checkbox, Card, Text } from '@sanity/ui'

export default function IngredientPicker(props) {
  const { value, onChange } = props
  const client = useClient({ apiVersion: '2021-05-19' })
  const document = useFormValue([])

  const [valueParsed, setValueParsed] = useState(
    value ? JSON.parse(value) : {}
  )

  // Get all ingredient titles + IDs
  const [allIngredients, setAllIngredients] = useState(false)
  useEffect(() => {
    const query = '*[_type == "ingredient"]{_id, title}'
    client.fetch(query).then((res) => {
      const allList = {}
      res.forEach((item) => (allList[item._id] = item.title))
      setAllIngredients(allList)
    })
  }, [client])

  // Get current ingredients from document
  const ingredientList = useMemo(() => {
    if (!document?.ingredientSets) return {}
    const list = {}

    document.ingredientSets.forEach((ingredientSet) => {
      list[ingredientSet.title] = {}

      ingredientSet.ingredients?.forEach((item) => {
        list[ingredientSet.title][item._key] = {
          id: item.ingredient?._ref,
          title: allIngredients
            ? allIngredients[item.ingredient?._ref]
            : 'Loading...',
        }
      })
    })

    return list
  }, [document?.ingredientSets, allIngredients])

  const handleChange = useCallback(
    (setTitle, ingredientKey, ingredient) => {
      const updatedValue = { ...valueParsed }

      if (valueParsed[setTitle] && valueParsed[setTitle][ingredientKey]) {
        delete updatedValue[setTitle][ingredientKey]
        if (Object.keys(updatedValue[setTitle]).length === 0) {
          delete updatedValue[setTitle]
        }
      } else {
        if (!updatedValue[setTitle]) {
          updatedValue[setTitle] = {}
        }
        updatedValue[setTitle][ingredientKey] = ingredient
      }

      setValueParsed(updatedValue)
      onChange(
        Object.keys(updatedValue).length > 0
          ? set(JSON.stringify(updatedValue))
          : unset()
      )
    },
    [valueParsed, onChange]
  )

  return (
    <Stack space={3}>
      {Object.keys(ingredientList).map((setTitle) => (
        <Card key={setTitle} padding={3} border>
          <Text weight="semibold" size={1}>
            {setTitle}
          </Text>
          <Stack space={2} marginTop={2}>
            {Object.keys(ingredientList[setTitle]).map((ingredientKey) => (
              <label
                key={`${setTitle}-${ingredientKey}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Checkbox
                  onChange={() =>
                    handleChange(
                      setTitle,
                      ingredientKey,
                      ingredientList[setTitle][ingredientKey]
                    )
                  }
                  checked={
                    !!(
                      valueParsed[setTitle] &&
                      valueParsed[setTitle][ingredientKey]
                    )
                  }
                />
                <Text size={1}>
                  {ingredientList[setTitle][ingredientKey].title}
                </Text>
              </label>
            ))}
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}
