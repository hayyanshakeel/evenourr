// components/product/product-context.tsx

'use client';

import { Product, ProductVariant } from '@/lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';

export interface ProductContextType {
  product: Product;
  selectedVariantId: string | undefined;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
  product
}: {
  children: React.ReactNode;
  product: Product;
}) => {
  const searchParams = useSearchParams();

  // This is the key change: We derive the selected variant ID
  // from the URL search parameters (color and size).
  const selectedVariantId = useMemo(() => {
    const selectedColor = searchParams.get('color');
    const selectedSize = searchParams.get('size');

    // Find the variant that matches the selected options
    const variant = product.variants.find((v: ProductVariant) => {
      const colorMatch =
        !selectedColor ||
        v.selectedOptions.some(
          (opt) => opt.name.toLowerCase() === 'color' && opt.value === selectedColor
        );
      const sizeMatch =
        !selectedSize ||
        v.selectedOptions.some(
          (opt) => opt.name.toLowerCase() === 'size' && opt.value === selectedSize
        );
      return colorMatch && sizeMatch;
    });

    // Fallback to the first available variant if no match is found
    return variant?.id || product.variants[0]?.id;
  }, [searchParams, product.variants]);

  return (
    <ProductContext.Provider
      value={{
        product,
        selectedVariantId
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};