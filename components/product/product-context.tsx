// components/product/product-context.tsx

'use client';

import { getProduct } from 'lib/shopify';
import type { Product, ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useMemo, useState } from 'react';

type ProductContextState = {
  variant?: ProductVariant;
  quantity: number;
  color?: string;
  size?: string;
};

const ProductContext = createContext<{
  state: ProductContextState;
  updateOption: (name: string, value: string) => ProductContextState;
}>({
  state: {
    quantity: 1
  },
  updateOption: () => {
    throw new Error('Not implemented');
  }
});

export function ProductProvider({ children, product }: { children: React.ReactNode; product: Product }) {
  const searchParams = useSearchParams();

  const initialVariant = useMemo(() => {
    let variant: ProductVariant | undefined;
    for (const v of product.variants) {
      if (v.availableForSale) {
        variant = v;
        break;
      }
    }
    if (!variant) {
      variant = product.variants[0];
    }
    return variant;
  }, [product.variants]);

  const [state, setState] = useState<ProductContextState>({
    variant: initialVariant,
    quantity: 1,
    // FIX: Correctly get initial color and size from the variant's selectedOptions
    color: initialVariant?.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color')?.value,
    size: initialVariant?.selectedOptions.find((opt) => opt.name.toLowerCase() === 'size')?.value
  });

  const updateOption = (name: string, value: string) => {
    const newState = { ...state, [name.toLowerCase()]: value };
    const { color, size } = newState;
    let newVariant: ProductVariant | undefined;

    for (const v of product