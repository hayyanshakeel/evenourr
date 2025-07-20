// app/studio/sanity.config.ts

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from 'sanity/schemaTypes' // Corrected path
import {structure} from 'sanity/structure' // Import the structure from your file

export default defineConfig({
  name: 'default',
  title: 'jsevenour',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    // Use the structure from your file
    structureTool({
      structure
    })
  ],

  schema: {
    types: schemaTypes
  }
})