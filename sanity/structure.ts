// sanity/structure.ts

import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
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
        (item) => !['siteSettings'].includes(item.getId() || '')
      )
    ])