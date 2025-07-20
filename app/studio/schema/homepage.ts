// studio/schemas/homepage.ts

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
        name: 'featuredProduct1',
        title: 'Featured Product 1 (Large)',
        type: 'reference',
        to: [{type: 'product'}],
        description: 'Select the main, large featured product for the homepage.',
    }),
    defineField({
        name: 'featuredProduct2',
        title: 'Featured Product 2 (Small)',
        type: 'reference',
        to: [{type: 'product'}],
        description: 'Select the first small featured product.',
    }),
    defineField({
        name: 'featuredProduct3',
        title: 'Featured Product 3 (Small)',
        type: 'reference',
        to: [{type: 'product'}],
        description: 'Select the second small featured product.',
    }),
  ],
})