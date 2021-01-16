import S from '@sanity/desk-tool/structure-builder'
import { FiBook, FiBookmark, FiSettings, FiTag } from 'react-icons/fi'

// We filter document types defined in structure to prevent
// them from being listed twice
const hiddenDocTypes = (listItem) =>
  !['site-config', 'recipe', 'ingredient', 'category'].includes(
    listItem.getId()
  )

export default () =>
  S.list()
    .title('Site')
    .items([
      S.listItem()
        .title('Site config')
        .icon(FiSettings)
        .child(
          S.editor()
            .id('config')
            .schemaType('site-config')
            .documentId('global-config')
        ),
      S.listItem()
        .icon(FiBook)
        .title('Recipes')
        .schemaType('recipe')
        .child(S.documentTypeList('recipe').title('Recipes')),
      S.listItem()
        .icon(FiBookmark)
        .title('Ingredients')
        .schemaType('ingredient')
        .child(S.documentTypeList('ingredient').title('Ingredients')),
      S.listItem()
        .icon(FiTag)
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
