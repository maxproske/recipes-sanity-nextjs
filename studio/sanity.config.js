import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemas'
import { structure, defaultDocumentNode } from './src/desk-structure'

export default defineConfig({
  name: 'recipes',
  title: 'Recipes',
  projectId: 'fymv8y7w',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
      defaultDocumentNode,
    }),
    visionTool({ defaultApiVersion: '2021-10-21' }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Only allow update and publish for site-config
      if (context.schemaType === 'site-config') {
        return prev.filter(
          ({ action }) => action === 'publish' || action === 'discardChanges' || action === 'restore'
        )
      }
      return prev
    },
  },
})
