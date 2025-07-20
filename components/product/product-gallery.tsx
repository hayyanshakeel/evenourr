'use client';

import { Gallery } from './gallery';
import { Image } from 'lib/shopify/types';

export function ProductGallery({ images }: { images: Image[] }) {
  const formattedImages = images.map(image => ({
    src: image.url,
    altText: image.altText || 'Product image'
  }));
  return <Gallery images={formattedImages} />;
}
