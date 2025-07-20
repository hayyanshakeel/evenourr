'use client';

import { ProductOption, ProductVariant } from 'lib/shopify/types';

export function ProductDetails({ 
  options, 
  variants, 
  onOpenSizeSelector 
}: { 
  options: ProductOption[];
  variants: ProductVariant[];
  onOpenSizeSelector: () => void;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
      <div className="mt-4 space-y-6">
        <p className="text-sm text-gray-600">Select your options below</p>
        <button 
          onClick={onOpenSizeSelector}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Choose size
        </button>
      </div>
    </div>
  );
}
