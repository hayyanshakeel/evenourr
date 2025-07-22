// app/[page]/opengraph-image.tsx

import OpengraphImage from 'components/opengraph-image';

// This is the metadata for your Open Graph image.
// It no longer depends on any Shopify functions.
export const runtime = 'edge';

export default async function Image({ params }: { params: { page: string } }) {
  // Since the original getPage function is gone, we'll use a placeholder title.
  // You can enhance this later if you build out a full content management system.
  const title = `Your Store - ${params.page.charAt(0).toUpperCase() + params.page.slice(1)}`;
  
  return await OpengraphImage({ title });
}