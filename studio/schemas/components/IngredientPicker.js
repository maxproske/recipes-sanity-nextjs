import React, { useRef, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withDocument } from 'part:@sanity/form-builder'

// Important items to allow form fields to work properly and patch the dataset.
import FormField from 'part:@sanity/components/formfields/default'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'

// Import the TextInput from UI
import { TextInput, Stack, Checkbox, Button } from '@sanity/ui'

const client = require('../../../web/client')

// 4. Create a Sanity PatchEvent based on a change in time value
const createPatchFrom = (value) =>
  PatchEvent.from(value === {} ? unset() : set(value))

const IngredientPicker = React.forwardRef((props, ref) => {
  const { type, value, document, onChange } = props

  // Split value into array for checking
  const [valueParsed, setValueParsed] = useState(value ? JSON.parse(value) : {})

  // Get all ingredients titles + IDs
  const [allIngredients, setAllIngredients] = useState(false)
  useEffect(() => {
    const query = '*[_type == "ingredient"]{_id, title}'
    client.fetch(query).then((res) => {
      const allList = {}
      res.forEach((item) => (allList[item._id] = item.title))
      setAllIngredients(allList)
    })
  }, [])

  // Get current ingredients from document
  const ingredientList = useMemo(() => {
    const list = {}

    // forEach set
    document.ingredientSets.forEach((set) => {
      list[set.title] = {}

      // forEach ingredient in set
      set.ingredients.forEach((item, index) => {
        // Key of this array item
        list[set.title][item._key] = {
          id: item.ingredient._ref, // ID of this ingredient
          title: allIngredients
            ? allIngredients[item.ingredient._ref]
            : `Loading ${index}...`, // Title of this ingredient
        }
      })
    })

    return list
  }, [document.ingredientSets, allIngredients])

  // 6. Called by the Sanity form-builder when this input should receive focus
  // focus = () => {
  //   timeInput.current.focus()
  // }

  // 7. Function called whenever an editor changes a value
  const handleChange = (setTitle, ingredientKey, ingredient) => {
    const updatedValue = { ...valueParsed }

    // If it already exists in the Value
    if (valueParsed[setTitle] && valueParsed[setTitle][ingredientKey]) {
      // Remove ingredient
      delete updatedValue[setTitle][ingredientKey]

      // Remove set, if empty
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
    onChange(createPatchFrom(JSON.stringify(updatedValue)))
  }

  return (
    <FormField label={type.title} description={type.description}>
      {/* <Button
        onClick={() => {
          onChange(createPatchFrom(JSON.stringify({})))
          setValueParsed({})
        }}
        padding={[3, 3, 4]}
        text="Reset Values"
      /> */}
      {value && false && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#efefef',
          }}
        >
          {typeof value === 'string' ? value : 'Value is not a string'}
        </div>
      )}
      {/* <TextInput
        type="text"
        ref={ref}
        placeholder={type.placeholder}
        value={props.value}
        onChange={(event) => {
          onChange(PatchEvent.from(set(event.target.value)))
        }}
      /> */}
      {Object.keys(ingredientList).map((setTitle) => (
        <div key={setTitle}>
          <p>
            <strong>{setTitle}</strong>
          </p>
          <Stack>
            {Object.keys(ingredientList[setTitle]).map((ingredientKey) => (
              <label
                key={`${setTitle}-${ingredientKey}`}
                htmlFor={`${setTitle}-${ingredientKey}`}
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
                    valueParsed[setTitle] &&
                    valueParsed[setTitle][ingredientKey]
                  }
                  id={`${setTitle}-${ingredientKey}`}
                />
                <span style={{ marginLeft: '0.5rem' }}>
                  {ingredientList[setTitle][ingredientKey].title}
                </span>
              </label>
            ))}
          </Stack>
        </div>
      ))}
    </FormField>
  )
})

export default withDocument(IngredientPicker)

// Shoosh, eslint
IngredientPicker.displayName = 'IngredientPicker'
IngredientPicker.propTypes = {
  type: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  document: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}
