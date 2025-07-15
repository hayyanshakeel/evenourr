// components/product/product-description.tsx

'use client';

import Price from 'components/price';
import { useProduct } from 'components/product/product-context';
import { VariantSelector } from 'components/product/variant-selector';
import type { Product } from 'lib/shopify/types';
import { useMemo } from 'react';

export function ProductDescription({ product }: { product: Product }) {
  const { state } = useProduct();

  // This logic correctly finds the full variant object based on the selected options.
  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => state[option.name.toLowerCase()] === option.value
      )
    );
  }, [product.variants, state]);

  // We determine the correct price to display.
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

      {/* The variant selector will appear here if the product has options. */}
      <VariantSelector options={product.options} />
    </>
  );
}