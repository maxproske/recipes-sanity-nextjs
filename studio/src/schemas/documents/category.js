import { FiTag } from 'react-icons/fi'

export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: FiTag,
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
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
