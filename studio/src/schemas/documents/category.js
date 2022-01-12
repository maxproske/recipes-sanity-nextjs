import { FiTag } from 'react-icons/fi'
import { qF } from 'sanity-quick-fields'

export default {
  ...qF('category', 'document'),
  icon: FiTag,
  fields: [qF('title'), qF('plural')],
  preview: {
    select: {
      title: 'title',
    },
  },
}
