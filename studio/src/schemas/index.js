// First, we must import the schema creator
import {defineConfig} from 'sanity'

// Document types
import recipe from './documents/recipe'
import ingredient from './documents/ingredient'
import siteConfig from './documents/siteConfig'

// Object types
import cta from './objects/cta'
import embedHTML from './objects/embedHTML'
import figure from './objects/figure'
import link from './objects/link'
import portableText from './objects/portableText'
import simplePortableText from './objects/simplePortableText'

// Custom Object
import ingredientPicker from './objects/ingredientPicker'
import ingredientAmount from './objects/ingredientAmount'
import temperature from './objects/temperature'
import category from './documents/category'

// Then we give our schema to the builder and provide the result to Sanity
export default defineConfig({
  name: 'default',
  // Then proceed to concatenate our our document type
  // to the ones provided by any plugins that are installed
  types: [
    cta,
    embedHTML,
    figure,
    temperature,
    link,
    recipe,
    ingredient,
    category,
    portableText,
    simplePortableText,
    siteConfig,
    ingredientPicker,
    ingredientAmount,
  ],
})
