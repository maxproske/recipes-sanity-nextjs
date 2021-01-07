export const options = [
  {
    title: 'Conversion',
    options: ['Automatic', 'Manual'],
  },
]

export const units = {
  Traditional: [
    { title: 'Cup', titlePlural: 'Cups', value: 'cup', type: 'Volume' },
    { title: 'Tsp', value: 'tsp', type: 'Volume' },
    { title: 'Tbsp', value: 'tbsp', type: 'Volume' },
  ],
  Metric: [
    { title: 'Gram', titlePlural: 'Grams', value: 'g', type: 'Weight' },
    { title: 'mL', value: 'ml', type: 'Volume' },
  ],
  Imperial: [
    { title: 'Oz', value: 'oz', type: 'Weight' },
    { title: 'Fl Oz', value: 'fl-oz', type: 'Volume' },
  ],
  Fuzzy: [
    { title: 'Quantity', value: 'quantity' },
    { title: 'Pinch', value: 'pinch' },
    { title: 'Sprinkle', value: 'sprinkle' },
  ],
}

export function getUnitDetails(Standard, unitValue) {
  const unit = units[Standard]
    ? units[Standard].filter((measure) => measure.value === unitValue)
    : false

  if (unit && unit.length > 0) {
    return {
      unitTitle: unit[0].title,
      unitTitlePlural: unit[0].titlePlural || '',
      type: unit[0].type,
    }
  }

  return {}
}
