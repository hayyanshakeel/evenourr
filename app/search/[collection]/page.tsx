// File: app/search/[collection]/page.tsx

import { db } from '@/lib/db';
import { products as productsTable, categories as categoriesTable, productsToCategories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';

// This function generates the page title based on the collection
export async function generateMetadata({ params }: { params: { collection: string } }): Promise<Metadata> {
  // FIX: Changed 'categoriesTable' to 'categories' to match the query helper
  const category = await db.query.categories.findFirst({
    where: eq(categoriesTable.handle, params.collection),
  });

  if (!category) return notFound();

  return {
    title: category.title,
    description: `Products in the ${category.title} collection`,
  };
}

// This is the main page component that fetches and displays products
export default async function CategoryPage({ params }: { params: { collection: string } }) {
  // Find the category ID from its handle (e.g., 't-shirts')
  const category = await db.query.categories.findFirst({
    where: eq(categoriesTable.handle, params.collection),
    columns: { id: true },
  });

  if (!category) return notFound();

  // 1. Fetch the raw product data from the database
  const rawProducts = await db
    .select({
      id: productsTable.id,
      handle: productsTable.slug,
      title: productsTable.name,
      price: productsTable.price, // Fetch the price as a number
      imageUrl: productsTable.imageUrl,
    })
    .from(productsTable)
    .leftJoin(productsToCategories, eq(productsTable.id, productsToCategories.productId))
    .where(eq(productsToCategories.categoryId, category.id))
    .orderBy(desc(productsTable.createdAt));

  // 2. Transform the raw data into the shape the component expects
  const formattedProducts = rawProducts.map((product) => ({
    id: product.id,
    handle: product.handle,
    title: product.title,
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