import { qF } from 'sanity-quick-fields'

export default {
  ...qF('category', 'document'),
  fields: [qF('title'), qF('plural')],
  preview: {
    select: {
      title: 'title',
    },
  },
}
