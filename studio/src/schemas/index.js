// Document types
import recipe from './documents/recipe'
import ingredient from './documents/ingredient'
import category from './documents/category'
import siteConfig from './documents/siteConfig'

// Object types
import cta from './objects/cta'
import embedHTML from './objects/embedHTML'
import figure from './objects/figure'
import link from './objects/link.jsx'
import portableText from './objects/portableText'
import simplePortableText from './objects/simplePortableText'
import ingredientPicker from './objects/ingredientPicker'
import ingredientAmount from './objects/ingredientAmount'
import temperature from './objects/temperature.jsx'

export const schemaTypes = [
  // Documents
  recipe,
  ingredient,
  category,
  siteConfig,
  // Objects
  cta,
  embedHTML,
  figure,
  link,
  portableText,
  simplePortableText,
  ingredientPicker,
  ingredientAmount,
  temperature,
]
