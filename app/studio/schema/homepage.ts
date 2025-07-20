// FILE: app/studio/schemas/homepage.ts

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Homepage Content',
      readOnly: true,
    }),
    defineField({
        name: 'mainFeaturedProduct',
        title: 'Main Featured Product (Large)',
        type: 'string',
        description: "Enter the product handle (e.g., 'classic-t-shirt')",
    }),
    defineField({
        name: 'secondaryFeaturedProduct1',
        title: 'Secondary Featured Product 1 (Small)',
        type: 'string',
        description: "Enter the product handle",
    }),
    defineField({
        name: 'secondaryFeaturedProduct2',
        title: 'Secondary Featured Product 2 (Small)',
        type: 'string',
        description: "Enter the product handle",
    }),
  ],
})