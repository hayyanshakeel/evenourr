'use client';

import Image from 'next/image';
import { useState } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="relative h-full w-full">
      {/* Image Carousel */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              className="h-full w-full object-cover"
              fill
              sizes="100vw"
              alt={image.altText}
              src={image.src}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Wishlist Button */}
      <div className="absolute bottom-6 right-4">
        {/* Updated styles for a black circle background */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-md backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // Heart icon is now white
            className="h-5 w-5 text-white"
            fill={isWishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 flex w-full justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}