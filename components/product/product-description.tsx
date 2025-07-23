// File: components/product/product-description.tsx

'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product } from 'lib/definitions';
import { VariantSelector } from './variant-selector';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ProductDescription({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const variant = product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => option.value === searchParams.get(option.name.toLowerCase())
      )
    );

    if (variant) {
      setSelectedVariantId(variant.id);
    } else if (product.variants.length === 1) {
      setSelectedVariantId(product.variants[0]?.id);
    }
  }, [searchParams, product.variants, setSelectedVariantId]);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>

      <VariantSelector variants={product.variants} />

      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}

      {/* This is the fix:
        - We convert selectedVariantId from a string to a number using parseInt().
        - We also handle the case where it might be undefined.
      */}
      <AddToCart
        availableForSale={product.availableForSale}
        selectedVariantId={selectedVariantId ? parseInt(selectedVariantId, 10) : undefined}
      />
    </>
  );
}