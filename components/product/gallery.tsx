'use client';

import Image from 'next/image';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  if (!images || images.length === 0) {
    return <div className="h-[75vh] w-full bg-gray-100" />; // Placeholder if no images
  }

  return (
    // Set a defined height for the gallery container
    <div className="relative h-[75vh] w-full">
      {/* Horizontally-scrolling container */}
      <div className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="relative h-full w-full flex-shrink-0 snap-center"
          >
            <Image
              // FIX: Changed back to 'object-cover' to fill the frame
              className="h-full w-full object-cover"
              fill
              sizes="100vw"
              alt={image.altText || 'Product image'}
              src={image.src}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots Overlay */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className="h-2 w-2 rounded-full bg-white/70 shadow-md backdrop-blur-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}