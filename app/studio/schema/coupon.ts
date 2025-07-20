// studio/schemas/coupon.ts

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
      description: 'The actual code customers will enter (e.g., SUMMER15).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main title for the coupon card (e.g., 15% OFF).',
    }),
    defineField({
      name: 'subTitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Text that appears below the title (e.g., UNLIMITED).',
    }),
    defineField({
        name: 'savedAmount',
        title: 'Saved Amount Text',
        type: 'string',
        description: 'Text to display for the saved amount (e.g., 60.30).',
    }),
    defineField({
        name: 'validity',
        title: 'Validity Text',
        type: 'string',
        description: 'The expiry date text (e.g., 2025/07/17 - 2025/08/16).',
    }),
    defineField({
      name: 'isRecommended',
      title: 'Is Recommended?',
      type: 'boolean',
      description: 'Turn this on to show the "RECOMMENDED" badge.',
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