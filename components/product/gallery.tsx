// File: components/product/gallery.tsx

'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
import { Image as ImageType } from '@/lib/definitions'; // Import the correct Image type

export function Gallery({ images }: { images: ImageType[] }) { // Use the imported ImageType
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set('image', nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set('image', previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);

  const buttonClassName = 'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';
  const mainImage = images[imageIndex];

  // This is the fix: We trim the URL and handle cases where it might be missing
  const imageUrl = mainImage?.url?.trim(); // Changed from .src to .url

  return (
    <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
      {/* We now use the cleaned 'imageUrl' */}
      {imageUrl ? (
        <Image
          className="h-full w-full object-contain"
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          priority
          src={imageUrl}
          alt={mainImage?.altText || 'Product image'}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-800" />
      )}

      {images.length > 1 ? (
        <div className="absolute bottom-[15%] flex w-full justify-center">
          <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
            <Link aria-label="Previous product image" href={previousUrl} className={buttonClassName} scroll={false}>
              <ArrowLeftIcon className="h-5" />
            </Link>
            <div className="mx-1 h-6 w-px bg-neutral-500"></div>
            <Link aria-label="Next product image" href={nextUrl} className={buttonClassName} scroll={false}>
              <ArrowRightIcon className="h-5" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}