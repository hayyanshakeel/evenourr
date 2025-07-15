'use client';

import Image from 'next/image';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  // We're only displaying the first image for this simplified design.
  const mainImage = images[0];

  if (!mainImage) {
    return null;
  }

  return (
    <div className="relative aspect-square h-full w-full overflow-hidden">
      <Image
        className="h-full w-full object-contain" // This class ensures the image fits
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        alt={mainImage.altText}
        src={mainImage.src}
        priority={true}
      />
    </div>
  );
}