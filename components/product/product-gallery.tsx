'use client';

import { useState } from 'react';
import { Image } from 'lib/shopify/types';

export function ProductGallery({ images }: { images: Image[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="h-[75vh] w-full bg-gray-100" />; // Placeholder if no images
  }

  return (
    <div className="flex gap-4">
      {/* Vertical Thumbnails */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[75vh] w-20">
        {images.map((image, index) => (
          <button
            key={image.url}
            onClick={() => setSelectedIndex(index)}
            className={`border rounded-md overflow-hidden focus:outline-none ${
              selectedIndex === index ? 'border-black' : 'border-gray-300'
            }`}
          >
            <img
              src={image.url}
              alt={image.altText || 'Product thumbnail'}
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 h-[75vh] w-full">
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].altText || 'Product image'}
          className="h-full w-full object-cover rounded-md"
        />
      </div>
    </div>
  );
}
