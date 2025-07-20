'use client';

import { useCart } from '@/components/cart/cart-context';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { useState } from 'react';
import { ProductDescription } from './product-description';

export default function QuickView({ product }: { product: Product }) {
  const { addToCart } = useCart(); // Now this should work
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant);
      // You might want to show a confirmation message here
    }
  };

  return (
    <div className="p-4">
      <ProductDescription product={product} />
      {/* You can add a button here to trigger handleAddToCart */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant}
        className="mt-4 w-full rounded-full bg-blue-600 p-4 text-sm font-semibold tracking-wide text-white hover:opacity-90 disabled:opacity-50"
      >
        Add To Cart
      </button>
    </div>
  );
}
