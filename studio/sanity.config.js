import { defineConfig } from "sanity";
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import deskStructure from './src/desk-structure'
import { dashboardTool } from "@sanity/dashboard";
import { documentListWidget } from "sanity-plugin-dashboard-widget-document-list";
import schemas from './src/schemas'

export default defineConfig({
  name: 'default',
  title: "Recipes",
  projectId: "fymv8y7w",
  dataset: "production",
  plugins: [
    deskTool({
      structure: deskStructure
    }), 
    dashboardTool({
      widgets: [
        documentListWidget(),
      ],
    }),
    visionTool()
  ],
  schema: {
    types: schemas,
  },
});