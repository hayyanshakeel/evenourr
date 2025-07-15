// components/product/product-description.tsx

'use client';

import { Price } from 'components/price';
import Prose from 'components/prose';
import StarRatingPlaceholder from 'components/StarRatingPlaceholder';
import type { Product } from 'lib/shopify/types';
import { useProduct } from './product-context';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  const { state } = useProduct();
  const { variant } = state;

  return (
    <>
      <div className="mb-6 flex flex-col gap-y-3 border-b pb-6 dark:border-neutral-700">
        <h1 className="text-2xl font-medium uppercase">{product.title}</h1>

        <div className="text-xl font-semibold">
          <Price
            amount={variant?.price.amount || product.priceRange.minVariantPrice.amount}
            currencyCode={
              variant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode
            }
          />
        </div>
        
        <StarRatingPlaceholder />
      </div>

      <VariantSelector options={product.options} />

      {product.descriptionHtml ? (
        <Prose
          className="my-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
    </>
  );
}