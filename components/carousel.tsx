// File: components/carousel.tsx

import Link from 'next/link';
import { GridTileImage } from 'components/grid/tile';
import prisma from '@/lib/db';

export async function Carousel() {
  try {
    // Fetch the 8 most recent products
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!products?.length) return null;

    // Format the data to match what GridTileImage expects
    const carouselProducts = products.map((product) => ({
      handle: product.slug,
      title: product.name,
      priceRange: {
        maxVariantPrice: {
          amount: product.price.toString(),
          currencyCode: 'USD'
        }
      },
      featuredImage: {
        url: product.images && product.images.length > 0
          ? product.images[0]?.imageUrl || 'https://via.placeholder.com/300x300'
          : product.imageUrl || 'https://via.placeholder.com/300x300',
        altText: product.name
      }
    }));

    return (
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {carouselProducts.map((product, i) => (
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
                  src={product.featuredImage.url}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching carousel products:', error);
    
    // Fallback to mock data if database fails
    const mockProducts = [
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
          url: 'https://via.placeholder.com/300x300?text=Headphones',
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
          url: 'https://via.placeholder.com/300x300?text=Speaker',
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
          url: 'https://via.placeholder.com/300x300?text=Smart+Watch',
          altText: 'Smart Watch'
        }
      }
    ];

    return (
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {mockProducts.map((product, i) => (
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
                  src={product.featuredImage.url}
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
}
