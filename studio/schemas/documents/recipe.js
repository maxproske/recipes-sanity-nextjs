import { FiType, FiList, FiGrid } from 'react-icons/fi'
import { qF, qFB } from '../../../../sanity-quick-fields'

function toPlainText(blocks = []) {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map((child) => child.text).join('')
    })
    .join('\n\n')
}

export default {
  ...qF('recipe', 'document'),
  fields: [
    qF('title'),
    qF('slug', 'slug', { source: 'title' }),
    qF('published', 'date'),
    qFB('ingredients', 'array').children([
      qFB('set', 'object').children([
        qF('title'),
        qFB('ingredients', 'array').children([
          {
            name: 'ingredient',
            title: 'Ingredient',
            type: 'object',
            fields: [
              qF('amount', 'number'),
              qF('measurement', 'string', {
                list: [
                  { title: 'mL', value: 'ml' },
                  { title: 'Cup', value: 'cup' },
                  { title: 'Tsp', value: 'tsp' },
                  { title: 'Tbsp', value: 'tbsp' },
                  { title: 'Gram', value: 'gram' },
                  { title: 'Oz', value: 'oz' },
                  { title: 'Sprinkle', value: 'sprinkle' },
                  { title: 'Pinch', value: 'pinch' },
                ],
              }),
              qF('ingredient', 'reference', { to: { type: 'ingredient' } }),
              qF('note'),
            ],
            preview: {
              select: {
                ingredient: 'ingredient.title',
                amount: 'amount',
                measurement: 'measurement',
                note: 'note',
              },
              prepare(selection) {
                const { ingredient, amount, measurement, note } = selection
                return {
                  title: note ? `${ingredient}, ${note}` : ingredient,
                  subtitle: [amount, measurement].join(' ').trim(),
                }
              },
            },
          },
        ]).toObject,
      ]),
    ]).toObject,
    qFB('method', 'array').children([
      // Title
      {
        ...qF('title', 'object'),
        fields: [qF('title', 'string')],
        icon: FiType,
        preview: {
          select: {
            title: 'title',
          },
          prepare(selection) {
            const { title } = selection
            return {
              title,
              subtitle: 'Title',
            }
          },
        },
      },
      // Text directions
      {
        ...qF('step', 'object'),
        fields: [qF('step', 'portableText')],
        icon: FiList,
        preview: {
          select: {
            step: 'step',
          },
          prepare(selection) {
            const { step } = selection
            return {
              title: toPlainText(step),
              subtitle: 'Step',
            }
          },
        },
      },
      // Component directions
      {
        ...qF('component', 'object'),
        fields: [
          qF('title'),
          qF('ingredients', 'ingredientPicker'),
          qF('description', 'portableText'),
        ],
        icon: FiGrid,
        preview: {
          select: {
            description: 'description',
          },
          prepare(selection) {
            const { description } = selection
            return {
              title: toPlainText(description),
              subtitle: 'Component',
            }
          },
        },
      },
    ]).toObject,
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
