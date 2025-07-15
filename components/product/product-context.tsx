// components/product/product-context.tsx

'use client';

import type { Product } from 'lib/shopify/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useMemo, useOptimistic } from 'react';

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
  children,
  product
}: {
  children: React.ReactNode;
  product: Product;
}) {
  const searchParams = useSearchParams();

  // FIX: This function now correctly sets a default state if URL params are missing
  const getInitialState = () => {
    const params: ProductState = {};
    const firstVariant = product.variants[0];

    // First, read any existing params from the URL
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    // If any options are missing from the URL params, set them from the first available variant.
    // This prevents the page from crashing on first load.
    for (const option of product.options) {
      const optionName = option.name.toLowerCase();
      if (!params[optionName] && firstVariant) {
        const firstVariantOption = firstVariant.selectedOptions.find(
          (o) => o.name.toLowerCase() === optionName
        );
        if (firstVariantOption) {
          params[optionName] = firstVariantOption.value;
        }
      }
    }

    return params;
  };

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update
    })
  );

  const updateOption = (name: string, value: string) => {
    const newState = { [name.toLowerCase()]: value };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  const updateImage = (index: string) => {
    const newState = { image: index };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage
    }),
    [state]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    // Using replace to avoid polluting browser history on variant selection
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };
}