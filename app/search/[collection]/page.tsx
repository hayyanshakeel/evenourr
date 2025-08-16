// File: app/search/[collection]/page.tsx

import prisma from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { getStoreCurrency } from '@/lib/currency-utils';

// This function generates the page title based on the collection
export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const collectionData = await prisma.collection.findFirst({ where: { handle: collection } });

  if (!collectionData) return notFound();

  return {
    title: collectionData.title,
    description: `Products in the ${collectionData.title} collection`,
  };
}

// This is the main page component that fetches and displays products
export default async function CategoryPage({ params }: { params: Promise<{ collection: string }> }) {
  noStore();
  const { collection } = await params;
  const collectionData = await prisma.collection.findFirst({ where: { handle: collection } });
  if (!collectionData) return notFound();
  const currency = await getStoreCurrency();

  // 1. Fetch the raw product data from the database
  const rawProducts = await prisma.product.findMany({ 
    where: { 
      productsToCollections: {
        some: {
          collectionId: collectionData.id
        }
      }
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  // 2. Transform the raw data into the shape the component expects
  const formattedProducts = rawProducts.map((product: any) => ({
    id: product.id,
    handle: product.slug,
    title: product.name,
    priceRange: {
      maxVariantPrice: {
        // Convert price from cents to dollars for display
        amount: (product.price / 100).toString(),
        currencyCode: currency,
      },
    },
    featuredImage: {
      url: (product as any).images && (product as any).images.length > 0 
        ? (product as any).images[0].imageUrl 
        : product.imageUrl,
    },
  }));

  return (
    <section>
      {formattedProducts.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* 3. Pass the correctly formatted products to the component */}
          <ProductGridItems products={formattedProducts as any} />
        </Grid>
      )}
    </section>
  );
}