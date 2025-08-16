import type { CmsLayoutData, CmsBlock } from './schema';

export function htmlToLayout(html: string): CmsLayoutData {
  // Minimal MVP: wrap HTML as a single block; renderer already supports 'html'
  const blocks: CmsBlock[] = [
    { id: crypto.randomUUID(), type: 'html' as any, props: { html } }
  ];
  return { version: 1, blocks };
}


