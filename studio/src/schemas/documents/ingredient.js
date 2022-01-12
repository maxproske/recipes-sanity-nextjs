import { FiBookmark } from 'react-icons/fi'
import { qF, qFB } from 'sanity-quick-fields'

export default {
  ...qF('ingredient', 'document'),
  icon: FiBookmark,
  fields: [
    qF('title'),
    qF('plural'),
    {
      name: `cupInGrams`,
      title: `1 Cup in Grams`,
      type: `number`,
      description: `1 Cup is 250mL`,
    },
    qFB('alternativeNames', 'array').children([qF('title')]).toObject,
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
