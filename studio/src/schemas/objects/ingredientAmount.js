import { qF, qFB } from 'sanity-quick-fields'

import IngredientAmount from '../components/IngredientAmount'

const ingredientShape = [
  qF('value', 'number'),
  qF('unit'),
  qF('standard'),
  qF('type'),
]

export default {
  name: 'ingredientAmount',
  title: 'Ingredient Amount',
  type: 'object',
  inputComponent: IngredientAmount,
  fields: [
    ...ingredientShape,
    qFB('amounts', 'array').children(ingredientShape).toObject,
  ],
}
