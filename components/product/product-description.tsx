'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { useMemo } from 'react';
import { Product, ProductVariant } from '@/lib/definitions';
import { useSearchParams } from 'next/navigation';

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const searchParams = useSearchParams();

  const selectedVariant = useMemo(() => {
    const variantId = searchParams.get('variant');
    if (variantId && product.variants) {
      return product.variants.find((v: ProductVariant) => v.id.toString() === variantId);
    }
    return product.variants?.[0];
  }, [searchParams, product.variants]);

  const price = selectedVariant ? selectedVariant.price : product.price;

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-3xl font-bold">{product.name}</h1> {/* Use name */}
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-lg text-white">
          <Price
            amount={price.toString()}
            currencyCode="USD"
          />
        </div>
      </div>

      {/* Your VariantSelector will go here */}

      {product.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description}
        />
      ) : null}

      <AddToCart
        availableForSale={true}
        selectedVariantId={selectedVariant?.id}
      />
    </>
  );
}