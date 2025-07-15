// components/product/product-description.tsx

'use client';

import Price from 'components/price';
import { useProduct } from 'components/product/product-context';
import { VariantSelector } from 'components/product/variant-selector';
import type { Product } from 'lib/shopify/types';
import { useMemo } from 'react';

export function ProductDescription({ product }: { product: Product }) {
  const { state } = useProduct();

  const selectedVariant = useMemo(() => {
    // This logic now works because the context provides a default state
    return product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => state[option.name.toLowerCase()] === option.value
      )
    );
  }, [product.variants, state]);

  // The price will now always be valid on first load
  const price = selectedVariant?.price || product.priceRange.maxVariantPrice;

  return (
    <>
      <div className="mb-6 flex flex-col gap-y-4 border-b pb-6 dark:border-neutral-700">
        <h1 className="text-2xl font-medium uppercase">{product.title}</h1>
        <div className="text-xl font-semibold">
          <Price
            amount={price.amount}
            currencyCode={price.currencyCode}
          />
        </div>
      </div>

      <VariantSelector options={product.options} />
    </>
  );
}