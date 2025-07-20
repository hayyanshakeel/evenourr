// FILE: app/studio/sanity.config.ts

import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from 'app/studio/schema'

export default defineConfig({
  name: 'default',
  title: 'Evenour CMS',

  projectId: '7z74tl10',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  basePath: '/studio', // This tells Next.js where your admin panel lives

  schema: {
    types: schemaTypes,
  },
})