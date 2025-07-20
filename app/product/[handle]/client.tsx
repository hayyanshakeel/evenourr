'use client';

import { Suspense, useState } from 'react';
import { Product } from 'lib/shopify/types';
import { ProductGallery } from 'components/product/product-gallery';
import { ProductDetails } from 'components/product/product-details';
import { ProductAccordion } from 'components/product/product-accordion';
import { Reviews } from 'components/product/reviews';
import { SuggestionCard } from 'components/product/suggestion-card';
import { ShareButton } from 'components/product/share-button';

export default function ProductPageClient({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [isSharePanelOpen, setIsSharePanelOpen] = useState(false);

  const openSizeSelector = () => setIsSizeSelectorOpen(true);
  const closeSizeSelector = () => setIsSizeSelectorOpen(false);

  const openSharePanel = () => setIsSharePanelOpen(true);
  const closeSharePanel = () => setIsSharePanelOpen(false);

  // Dummy reviews data for demonstration - replace with real data source
  const reviews = [
    {
      id: '1',
      user: 'a***i',
      country: '🇨🇦',
      date: '2025/06/26',
      rating: 5,
      size: 'Cream/XS',
      text: 'super cute!!',
      fit: 'True to size',
      height: '155cm / 5\'1"',
      bust: '73cm / 28.7"',
      waist: '60cm / 23.6"',
      hips: '78cm / 30.7"',
      photos: []
    },
    {
      id: '2',
      user: 'l***1',
      country: '🇳🇱',
      date: '2025/07/19',
      rating: 4,
      size: 'Cream/XS',
      text: 'Highlights the chest area more than I thought, but is really cute. Looks less than a corset when you wear it. Got many complements to the top the first day I wore it',
      fit: 'True to size',
      height: '160cm / 5\'2"',
      bust: '80cm / 31.5"',
      waist: '62cm / 24.4"',
      hips: '90cm / 35.4"',
      photos: ['https://example.com/photo1.jpg']
    },
    {
      id: '3',
      user: 'Q***e',
      country: '🇸🇰',
      date: '2025/06/22',
      rating: 5,
      size: 'Cream/XS',
      text: 'I am satisfied with what I received, looks just like the product in the pictures.',
      fit: 'True to size',
      height: '',
      bust: '',
      waist: '',
      hips: '',
      photos: ['https://example.com/photo2.jpg']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <Suspense fallback={<div className="h-[75vh] bg-gray-100 animate-pulse" />}>
          <ProductGallery images={product.images} />
        </Suspense>

        {/* Product Info */}
        <div>
          <ProductDetails
            options={product.options}
            variants={product.variants}
            onOpenSizeSelector={openSizeSelector}
          />

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

          {/* Product Description Accordion */}
          <div className="mt-6">
            <ProductAccordion product={product} />
          </div>

          {/* Reviews Section */}
          <Reviews reviews={reviews} />

          {/* You May Also Like */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4">You may also like</h2>
              <div className="grid grid-cols-2 gap-3">
                {relatedProducts.slice(0, 4).map((p) => (
                  <SuggestionCard 
                    key={p.handle} 
                    product={p} 
                    onQuickView={() => {}} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Selector Modal */}
      {isSizeSelectorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Size</h3>
              <button onClick={closeSizeSelector} className="text-2xl">&times;</button>
            </div>
            {/* Size selector content */}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isSharePanelOpen && (
        <ShareButton
          isOpen={isSharePanelOpen}
          onClose={closeSharePanel}
          productTitle={product.title}
          productImage={product.featuredImage?.url || ''}
          url={typeof window !== 'undefined' ? window.location.href : ''}
        />
      )}
    </div>
  );
}
