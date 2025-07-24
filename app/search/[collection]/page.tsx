// File: app/search/[collection]/page.tsx

import prisma from '@/lib/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';

// This function generates the page title based on the collection
export async function generateMetadata({ params }: { params: { collection: string } }): Promise<Metadata> {
  const collection = await prisma.collection.findFirst({ where: { handle: params.collection } });

  if (!collection) return notFound();

  return {
    title: collection.title,
    description: `Products in the ${collection.title} collection`,
  };
}

// This is the main page component that fetches and displays products
export default async function CategoryPage({ params }: { params: { collection: string } }) {
  const collection = await prisma.collection.findFirst({ where: { handle: params.collection } });
  if (!collection) return null; // or notFound()

  // 1. Fetch the raw product data from the database
  const rawProducts = await prisma.product.findMany({ 
    where: { 
      productsToCollections: {
        some: {
          collectionId: collection.id
        }
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
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      url: product.imageUrl,
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