'use client';

import Image from 'next/image';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  // Do not render gallery if no images are available
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      {/* Horizontally-scrolling container */}
      <div className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {images.map((image, index) => (
          <div
            key={image.src}
            className="h-full w-full flex-shrink-0 snap-center"
          >
            <Image
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
              // The active dot is difficult to track with pure CSS scroll-snapping,
              // so we'll just show the dots for visual reference without an active state.
              className="h-2 w-2 rounded-full bg-white/50 backdrop-blur-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}