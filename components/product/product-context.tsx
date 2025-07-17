// components/product/product-context.tsx

'use client';

import { Product } from '@/lib/shopify/types';
import { createContext, useContext, useState } from 'react';

export interface ProductContextType {
  product: Product;
  selectedVariantId: string | undefined;
  setSelectedVariantId: (variantId: string) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
  product
}: {
  children: React.ReactNode;
  product: Product;
}) => {
  // State to hold the currently selected variant ID
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants[0]?.id
  );

  return (
    <ProductContext.Provider
      value={{
        product,
        selectedVariantId,
        setSelectedVariantId
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