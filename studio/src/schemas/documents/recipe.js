import { FiType, FiList, FiGrid, FiBox, FiDroplet } from 'react-icons/fi'
import { qF, qFB } from 'sanity-quick-fields'
import { units } from '../components/amountSettings'

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
    qF('description', 'text', { rows: 3 }),
    qF('featuredImage', 'image'),
    // qF('published', 'date'),
    qF('category', 'reference', { to: { type: 'category' } }),
    qFB('ingredientSets', 'array').children([
      qFB('set', 'object', { icon: FiBox }).children([
        qF('title'),
        qFB('ingredients', 'array').children([
          {
            name: 'ingredient',
            title: 'Ingredient',
            type: 'object',
            fields: [
              qF('amount', 'ingredientAmount'),
              qF('ingredient', 'reference', { to: { type: 'ingredient' } }),
              qF('note'),
            ],
            icon: FiDroplet,
            preview: {
              select: {
                ingredient: 'ingredient.title',
                amount: 'amount.value',
                unit: 'amount.unit',
                note: 'note',
              },
              prepare(selection) {
                const { ingredient, amount, unit, note } = selection

                if (!amount && !unit) {
                  return {
                    title: ingredient,
                  }
                }

                const unitLabel =
                  amount !== 1 && units[unit].plural
                    ? units[unit].plural
                    : units[unit].single

                return {
                  title: ingredient,
                  subtitle: [amount, unitLabel, note ? `– ${note}` : '']
                    .join(' ')
                    .trim(),
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
      subtitle: 'slug.current',
      media: 'featuredImage',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection

      return {
        title,
        subtitle: `/${subtitle}`,
        media,
      }
    },
  },
}
