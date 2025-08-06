// File: components/grid/three-items.tsx

import Link from 'next/link';
import { GridTileImage } from 'components/grid/tile';

// Mock data for three items grid
const mockHomepageItems = [
  {
    handle: 'sample-product-1',
    title: 'Premium Headphones',
    priceRange: {
      maxVariantPrice: {
        amount: '299.99',
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: 'https://via.placeholder.com/400x400?text=Headphones',
      altText: 'Premium Headphones'
    }
  },
  {
    handle: 'sample-product-2',
    title: 'Wireless Speaker',
    priceRange: {
      maxVariantPrice: {
        amount: '199.99',
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: 'https://via.placeholder.com/400x400?text=Speaker',
      altText: 'Wireless Speaker'
    }
  },
  {
    handle: 'sample-product-3',
    title: 'Smart Watch',
    priceRange: {
      maxVariantPrice: {
        amount: '399.99',
        currencyCode: 'USD'
      }
    },
    featuredImage: {
      url: 'https://via.placeholder.com/400x400?text=Smart+Watch',
      altText: 'Smart Watch'
    }
  }
];

function ThreeItemGridItems() {
  const [firstProduct, secondProduct, thirdProduct] = mockHomepageItems;

  if (!firstProduct || !secondProduct || !thirdProduct) return null;

  return (
    <>
      <div className="relative aspect-square md:aspect-[4/5]">
        <Link className="relative h-full w-full" href={`/product/${firstProduct.handle}`}>
          <GridTileImage
            src={firstProduct.featuredImage.url}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            priority={true}
            className="object-cover"
            alt={firstProduct.featuredImage.altText}
            label={{
              title: firstProduct.title as string,
              amount: firstProduct.priceRange.maxVariantPrice.amount,
              currencyCode: firstProduct.priceRange.maxVariantPrice.currencyCode
            }}
          />
        </Link>
      </div>
      <div className="relative aspect-square md:aspect-[4/5]">
        <Link className="relative h-full w-full" href={`/product/${secondProduct.handle}`}>
          <GridTileImage
            src={secondProduct.featuredImage.url}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            priority={true}
            className="object-cover"
            alt={secondProduct.featuredImage.altText}
            label={{
              title: secondProduct.title as string,
              amount: secondProduct.priceRange.maxVariantPrice.amount,
              currencyCode: secondProduct.priceRange.maxVariantPrice.currencyCode
            }}
          />
        </Link>
      </div>
      <div className="relative aspect-square md:aspect-[4/5]">
        <Link className="relative h-full w-full" href={`/product/${thirdProduct.handle}`}>
          <GridTileImage
            src={thirdProduct.featuredImage.url}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            priority={true}
            className="object-cover"
            alt={thirdProduct.featuredImage.altText}
            label={{
              title: thirdProduct.title as string,
              amount: thirdProduct.priceRange.maxVariantPrice.amount,
              currencyCode: thirdProduct.priceRange.maxVariantPrice.currencyCode
            }}
          />
        </Link>
      </div>
    </>
  );
}

export function ThreeItemGrid() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItems />
    </section>
  );
}
