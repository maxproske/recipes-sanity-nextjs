import { qF, qFB } from 'sanity-quick-fields'

export default {
  ...qF('ingredient', 'document'),
  fields: [
    qF('title'),
    qF(['cupInGrams', '1 Cup in Grams'], 'number'),
    qFB('alternatives', 'array').children([qF('title')]).toObject,
    qFB('alternativeNames', 'array').children([qF('title')]).toObject,
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
