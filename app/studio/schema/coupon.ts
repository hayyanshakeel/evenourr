// FILE: app/studio/schemas/coupon.ts

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subTitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
        name: 'savedAmount',
        title: 'Saved Amount Text',
        type: 'string',
    }),
    defineField({
        name: 'validity',
        title: 'Validity Text',
        type: 'string',
    }),
    defineField({
      name: 'isRecommended',
      title: 'Is Recommended?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'title',
    },
  },
})