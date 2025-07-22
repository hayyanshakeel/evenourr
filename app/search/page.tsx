// app/search/page.tsx

import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';

// Define a type for your product object to satisfy TypeScript
type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: any[]; // You can define a more specific type for options if needed
  priceRange: {
    maxVariantPrice: { amount: string; currencyCode: string };
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: any[]; // You can define a more specific type for variants if needed
  featuredImage: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  seo: {
    title: string;
    description: string;
  };
  tags: string[];
  updatedAt: string;
};

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Explicitly type the products array to fix the error
  const products: Product[] = []; // This will be replaced with your API call

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} results for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <ProductGridItems products={products} />
      ) : null}
    </>
  );
}