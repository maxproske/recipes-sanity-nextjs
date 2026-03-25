import IngredientAmount from '../components/IngredientAmount.jsx'

export default {
  name: 'ingredientAmount',
  title: 'Ingredient Amount',
  type: 'object',
  components: {
    input: IngredientAmount,
  },
  fields: [
    {
      name: 'value',
      title: 'Value',
      type: 'number',
    },
    {
      name: 'unit',
      title: 'Unit',
      type: 'string',
    },
    {
      name: 'standard',
      title: 'Standard',
      type: 'string',
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
    },
    {
      name: 'amounts',
      title: 'Amounts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'number' },
            { name: 'unit', title: 'Unit', type: 'string' },
            { name: 'standard', title: 'Standard', type: 'string' },
            { name: 'type', title: 'Type', type: 'string' },
          ],
        },
      ],
    },
  ],
}
