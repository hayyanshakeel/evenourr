'use client';

import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { useState } from 'react';

export function ProductDetails({ 
  options, 
  variants, 
  onOpenSizeSelector 
}: { 
  options: ProductOption[];
  variants: ProductVariant[];
  onOpenSizeSelector: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="mt-4">
      {/* Product Title */}
      <h1 className="text-2xl font-bold uppercase text-gray-900">{options.find(o => o.name.toLowerCase() === 'title')?.values[0] || 'Product Title'}</h1>

      {/* Price */}
      <p className="mt-2 text-xl font-semibold text-gray-900">
        {/* Assuming price is handled outside or passed in */}
        {/* Placeholder price */}
        ₹1,551.00
      </p>

      {/* Color / Size Selector */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700 uppercase">Cream / Size</p>
        <p className="text-xs text-gray-400">This print is non-directional and may differ on each piece.</p>

        {/* Color Circle */}
        <div className="mt-2">
          <button className="h-8 w-8 rounded-full border border-gray-300 bg-[url('https://img.shopcider.com/hermes/posting/tiny-image-1752740869000-xcsmyt.png')] bg-cover" aria-label="Cream color" />
        </div>

        {/* Size Buttons */}
        <div className="mt-2 flex gap-2">
          {['XS', 'S', 'M', 'L', 'XL'].map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${
                selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Size Guide Link */}
        <button
          onClick={onOpenSizeSelector}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-700 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Size Guide & Model Info
        </button>
      </div>

      {/* Add to Bag Button */}
      <div className="mt-6">
        <button className="w-full rounded-lg bg-black py-3 text-center text-sm font-semibold text-white hover:bg-gray-900 transition-colors">
          Add to Bag
        </button>
      </div>

      {/* Shipping Info */}
      <div className="mt-4 text-sm text-gray-700">
        <p><strong>Shipping to INDIA</strong></p>
        <p>Express shipping available</p>
        <p>Shipping Time: 8 - 12 days</p>
      </div>
    </div>
  );
}
