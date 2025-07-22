'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryProps {
  images: { src: string; altText: string }[];
}

export function Gallery({ images }: GalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images.length) {
    return null;
  }

  const activeImage = images[activeImageIndex];

  return (
    <div className="flex flex-col">
      <div className="relative aspect-square h-full w-full max-h-[550px] overflow-hidden rounded-lg border">
        {activeImage && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={activeImage.altText}
            src={activeImage.src}
            priority={true}
          />
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <li key={image.src} className="h-20 w-20">
              <button
                onClick={() => setActiveImageIndex(index)}
                className={`h-full w-full rounded-lg border-2 overflow-hidden ${
                  index === activeImageIndex ? 'border-blue-600' : 'border-neutral-300'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.altText}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}