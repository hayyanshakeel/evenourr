// File: app/search/page.tsx

import { prisma } from '@/lib/db';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetch products for search
  const products = await prisma.products.findMany();

  // Format the data to match what the frontend components expect
  const formattedProducts = products.map((product) => ({
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

  const resultsText = formattedProducts.length > 1 ? 'results' : 'result';

  return (
    <>
      {formattedProducts.length > 0 ? (
        <div className="mb-4">
          <p className="text-sm">
            Showing {formattedProducts.length} {resultsText}.
          </p>
        </div>
      ) : null}
      {formattedProducts.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={formattedProducts as any} />
        </Grid>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-y-4 px-4 py-24">
          <h2 className="text-2xl font-bold">No products found</h2>
          <p>We could not find any products. Try searching for something else.</p>
        </div>
      )}
    </>
  );
}