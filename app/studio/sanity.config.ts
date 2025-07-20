// app/studio/sanity.config.ts

import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schema} from './schema'
import {structure} from '../../sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'jsevenour',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    deskTool({
      structure
    })
  ],

  schema: schema
})
