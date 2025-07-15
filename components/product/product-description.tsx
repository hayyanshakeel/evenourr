'use client';

import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { useState } from 'react';
import { ShareModal } from './share-modal';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-col">
        {/* Title and Share Button */}
        <div className="flex items-start justify-between">
          <h1 className="mb-2 flex-grow text-lg font-normal text-gray-800">{product.title}</h1>
          <button
            onClick={() => setIsShareModalOpen(true)}
            aria-label="Share product"
            className="p-2"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v12"
              />
            </svg>
          </button>
        </div>

        {/* Price and Reviews */}
        <div className="mb-4 flex items-center justify-between">
          <Price
            className="text-lg font-bold"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.45a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.374-2.45a1 1 0 00-1.175 0l-3.374 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.21 9.393c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
            <span>4.8</span>
            <span className="text-gray-400">(14)</span>
          </div>
        </div>

        <VariantSelector options={product.options} />
      </div>

      {/* Share Modal Component */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productTitle={product.title}
        productImage={product.featuredImage.url}
      />
    </>
  );
}