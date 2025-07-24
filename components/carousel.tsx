// File: components/carousel.tsx

import Link from 'next/link';
import { GridTileImage } from 'components/grid/tile';
import prisma from '@/lib/db';

export async function Carousel() {
  // Fetch the 8 most recent products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8
  });

  if (!products?.length) return null;

  // Format the data to match what GridTileImage expects
  const carouselProducts = products.map((product: any, i: number) => ({
    handle: product.slug,
    title: product.name,
    priceRange: {
      maxVariantPrice: {
        amount: (product.price / 100).toString(),
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: product.imageUrl
    }
  }));

  return (
    <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product: any, i: number) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/product/${product.handle}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage.url!}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}