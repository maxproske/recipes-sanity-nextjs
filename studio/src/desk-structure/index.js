import { FiBook, FiBookmark, FiSettings, FiTag } from 'react-icons/fi'
import { Iframe } from 'sanity-plugin-iframe-pane'
import resolveProductionUrl from '../resolveProductionUrl'

const hiddenDocTypes = (listItem) =>
  !['site-config', 'recipe', 'ingredient', 'category'].includes(
    listItem.getId()
  )

export const defaultDocumentNode = (S, { schemaType }) => {
  if (schemaType === 'recipe') {
    return S.document().views([
      S.view.form(),
      S.view
        .component(Iframe)
        .options({
          url: (doc) => resolveProductionUrl(doc),
          reload: { button: true },
        })
        .title('Preview'),
    ])
  }
  return S.document()
}

export const structure = (S) =>
  S.list()
    .title('Site')
    .items([
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
      S.divider(),
      S.listItem()
        .title('Settings')
        .icon(FiSettings)
        .child(
          S.document()
            .id('config')
            .schemaType('site-config')
            .documentId('global-config')
        ),
    ])
