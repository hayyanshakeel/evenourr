'use client';

import { Suspense, useState } from 'react';
import { Product, ProductOption, ProductVariant } from 'lib/shopify/types';
import { AddToCart } from 'components/cart/add-to-cart';

// --- FIX: Corrected import statements ---
import { ProductAccordion } from '/Users/hayyaanshakeel/Desktop/untitled folder 3/jsevenour/components/product/product-accordion';
import { ProductDetails } from '/Users/hayyaanshakeel/Desktop/untitled folder 3/jsevenour/components/product/product-details';
import { ShareButton } from '/Users/hayyaanshakeel/Desktop/untitled folder 3/jsevenour/components/product/share-button';

// --- FIX: Corrected the file path for ProductGallery ---
// The error "Cannot find module" means the file path is wrong. I've corrected it.
import { ProductGallery } from '/Users/hayyaanshakeel/Desktop/untitled folder 3/jsevenour/components/product/product-gallery';
import { SlideUpPanel } from '/Users/hayyaanshakeel/Desktop/untitled folder 3/jsevenour/components/product/slide-up-panel';
import { SuggestionCard } from '/Users/hayyaanshakeel/Desktop/untitled folder 3/jsevenour/components/product/suggestion-card';

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

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Product Gallery */}
          <Suspense fallback={<div>Loading gallery...</div>}>
            <ProductGallery images={product.images} />
          </Suspense>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{product.priceRange.maxVariantPrice.amount}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            <div className="mt-10">
                <div className="mt-10">
                    {/* --- FIX: Passed the entire 'product' object to AddToCart --- */}
                    <AddToCart product={product} />
                </div>
            </div>

            {/* --- FIX: Corrected props for ProductDetails --- */}
            <ProductDetails
              options={product.options}
              variants={product.variants}
              onOpenSizeSelector={openSizeSelector}
            />

            {/* --- FIX: Corrected props for ProductAccordion --- */}
            <ProductAccordion product={product} />

            <button onClick={openSharePanel} className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Share
            </button>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-24">
            <h2 className="text-xl font-bold">You may also like</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {relatedProducts.map((p) => (
                    // --- FIX: Corrected props for SuggestionCard ---
                    <SuggestionCard key={p.handle} product={p} onQuickView={() => { /* function logic here */ }} />
                ))}
            </div>
        </div>
      </div>

      <SlideUpPanel isOpen={isSizeSelectorOpen} onClose={closeSizeSelector}>
        {/* Content for size selector */}
        <h2>Select a size</h2>
      </SlideUpPanel>

      <ShareButton
        isOpen={isSharePanelOpen}
        onClose={closeSharePanel}
        productTitle={product.title}
        productImage={product.featuredImage?.url || ''}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </div>
  );
}