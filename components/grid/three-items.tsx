// File: components/grid/three-items.tsx

import Link from 'next/link';
import { GridTileImage } from 'components/grid/tile';
import { prisma } from '@/lib/db';

async function ThreeItemGridItems() {
  // Fetch the 3 most recent products
  const homepageItems = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  if (!homepageItems || homepageItems.length < 3) return null;

  // Format the data for display
  const [firstProduct, secondProduct, thirdProduct] = homepageItems.map((item: typeof homepageItems[number]) => ({
    handle: item.slug,
    title: item.name,
    priceRange: {
      maxVariantPrice: {
        amount: (item.price / 100).toString(),
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: item.imageUrl
    }
  }));

  if (!firstProduct || !secondProduct || !thirdProduct) return null;

  return [
    <div key={firstProduct.handle} className="col-span-2 row-span-2 h-full">
      <Link className="relative block aspect-square h-full w-full" href={`/product/${firstProduct.handle}`}>
        <GridTileImage
          src={firstProduct.featuredImage.url!}
          fill
          sizes="(min-width: 768px) 66vw, 100vw"
          priority
          alt={firstProduct.title}
          label={{
            position: 'bottom',
            title: firstProduct.title,
            amount: firstProduct.priceRange.maxVariantPrice.amount,
            currencyCode: firstProduct.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>,
    <div key={secondProduct.handle} className="col-span-1 row-span-2">
      <Link className="relative block aspect-square h-full w-full" href={`/product/${secondProduct.handle}`}>
        <GridTileImage
          src={secondProduct.featuredImage.url!}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          priority
          alt={secondProduct.title}
          label={{
            position: 'bottom',
            title: secondProduct.title,
            amount: secondProduct.priceRange.maxVariantPrice.amount,
            currencyCode: secondProduct.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>,
    <div key={thirdProduct.handle} className="col-span-1 row-span-2">
      <Link className="relative block aspect-square h-full w-full" href={`/product/${thirdProduct.handle}`}>
        <GridTileImage
          src={thirdProduct.featuredImage.url!}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          alt={thirdProduct.title}
          label={{
            position: 'bottom',
            title: thirdProduct.title,
            amount: thirdProduct.priceRange.maxVariantPrice.amount,
            currencyCode: thirdProduct.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>
  ];
}

export async function ThreeItemGrid() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-2 md:grid-rows-2">
      <ThreeItemGridItems />
    </section>
  );
}