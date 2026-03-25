import { FiBookmark } from 'react-icons/fi'

export default {
  name: 'ingredient',
  title: 'Ingredient',
  type: 'document',
  icon: FiBookmark,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'plural',
      title: 'Plural',
      type: 'string',
    },
    {
      name: 'cupInGrams',
      title: '1 Cup in Grams',
      type: 'number',
      description: '1 Cup is 250mL',
    },
    {
      name: 'alternativeNames',
      title: 'Alternative Names',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
