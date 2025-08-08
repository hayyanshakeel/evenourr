// File: components/grid/three-items.tsx

import Link from 'next/link';
import { GridTileImage } from 'components/grid/tile';
import prisma from '@/lib/db';
import { getStoreCurrency } from '@/lib/currency-utils';

async function ThreeItemGridItems() {
  try {
    // Get store currency
    const currency = await getStoreCurrency();
    
    // Fetch the 3 most recent products from Turso DB
    const homepageItems = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!homepageItems || homepageItems.length === 0) {
      // Return fallback mock data if no products in database
      const mockItems = [
        {
          handle: 'sample-product-1',
          title: 'Premium Headphones',
          priceRange: {
            maxVariantPrice: {
              amount: '299.99',
              currencyCode: currency
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
              currencyCode: currency
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
              currencyCode: currency
            }
          },
          featuredImage: {
            url: 'https://via.placeholder.com/400x400?text=Smart+Watch',
            altText: 'Smart Watch'
          }
        }
      ];
      
      return mockItems.map((item, index) => (
        <div key={index} className="relative aspect-square md:aspect-[4/5]">
          <Link className="relative h-full w-full" href={`/product/${item.handle}`}>
            <GridTileImage
              src={item.featuredImage.url}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              priority={true}
              className="object-cover"
              alt={item.featuredImage.altText}
              label={{
                title: item.title,
                amount: item.priceRange.maxVariantPrice.amount,
                currencyCode: item.priceRange.maxVariantPrice.currencyCode
              }}
            />
          </Link>
        </div>
      ));
    }

    // Format the data for display from Turso DB
    const formattedItems = homepageItems.map((item) => ({
      handle: item.slug,
      title: item.name,
      priceRange: {
        maxVariantPrice: {
          amount: item.price.toString(),
          currencyCode: currency
        }
      },
      featuredImage: {
        url: item.images && item.images.length > 0
          ? item.images[0]?.imageUrl || 'https://via.placeholder.com/400x400'
          : item.imageUrl || 'https://via.placeholder.com/400x400',
        altText: item.name
      }
    }));

    return formattedItems.map((item, index) => (
      <div key={index} className="relative aspect-square md:aspect-[4/5]">
        <Link className="relative h-full w-full" href={`/product/${item.handle}`}>
          <GridTileImage
            src={item.featuredImage.url}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            priority={true}
            className="object-cover"
            alt={item.featuredImage.altText}
            label={{
              title: item.title,
              amount: item.priceRange.maxVariantPrice.amount,
              currencyCode: item.priceRange.maxVariantPrice.currencyCode
            }}
          />
        </Link>
      </div>
    ));

  } catch (error) {
    console.error('Error fetching homepage items from Turso:', error);
    
    // Get currency for fallback as well
    const currency = await getStoreCurrency();
    
    // Return fallback UI on error
    const fallbackItems = [
      {
        handle: 'fallback-1',
        title: 'Featured Product 1',
        priceRange: { maxVariantPrice: { amount: '99.99', currencyCode: currency } },
        featuredImage: { url: 'https://via.placeholder.com/400x400?text=Product+1', altText: 'Featured Product 1' }
      },
      {
        handle: 'fallback-2',
        title: 'Featured Product 2',
        priceRange: { maxVariantPrice: { amount: '149.99', currencyCode: currency } },
        featuredImage: { url: 'https://via.placeholder.com/400x400?text=Product+2', altText: 'Featured Product 2' }
      },
      {
        handle: 'fallback-3',
        title: 'Featured Product 3',
        priceRange: { maxVariantPrice: { amount: '199.99', currencyCode: currency } },
        featuredImage: { url: 'https://via.placeholder.com/400x400?text=Product+3', altText: 'Featured Product 3' }
      }
    ];

    return fallbackItems.map((item, index) => (
      <div key={index} className="relative aspect-square md:aspect-[4/5]">
        <Link className="relative h-full w-full" href={`/product/${item.handle}`}>
          <GridTileImage
            src={item.featuredImage.url}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            priority={true}
            className="object-cover"
            alt={item.featuredImage.altText}
            label={{
              title: item.title,
              amount: item.priceRange.maxVariantPrice.amount,
              currencyCode: item.priceRange.maxVariantPrice.currencyCode
            }}
          />
        </Link>
      </div>
    ));
  }
}

export function ThreeItemGrid() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItems />
    </section>
  );
}
