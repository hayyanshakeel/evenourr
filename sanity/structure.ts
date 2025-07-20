// sanity/structure.ts

import type {StructureBuilder as SanityStructureBuilder} from 'sanity/desk'

export const structure = (S: SanityStructureBuilder) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // Your structure items
      // Example for a 'siteSettings' singleton
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      // Lists all other document types
      ...S.documentTypeListItems().filter(
        (item: any) => !['siteSettings'].includes(item.getId() || '')
      )
    ])
