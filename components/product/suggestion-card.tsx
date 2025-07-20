'use client';

import { Product } from 'lib/shopify/types';

export function SuggestionCard({ 
  product, 
  onQuickView 
}: { 
  product: Product;
  onQuickView: () => void;
}) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={product.featuredImage?.url || '/placeholder.jpg'}
          alt={product.featuredImage?.altText || product.title}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={`/product/${product.handle}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.handle}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          ${product.priceRange.minVariantPrice.amount}
        </p>
      </div>
      <button 
        onClick={onQuickView}
        className="mt-2 text-xs text-indigo-600 hover:text-indigo-500"
      >
        Quick view
      </button>
    </div>
  );
}
