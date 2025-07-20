'use client';

import { useProduct } from './product-context';

export function ProductDetails() {
  const { product } = useProduct();

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
      <div className="mt-4 space-y-6">
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>
    </div>
  );
}
