// File: components/product/product-page-client.tsx

'use client'; // This marks the component as a Client Component

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Gallery } from 'components/product/gallery';
import { ProductViewTracker, EngagementTracker } from '@/components/tracking/BehaviorTracking';

// Dynamically import ProductDescription with SSR turned off
const ProductDescription = dynamic(
  () => import('components/product/product-description').then((mod) => mod.ProductDescription),
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />
  }
);

// This component receives the product data as a prop
export function ProductPageClient({ product }: { product: any }) {
  // Transform product for tracking
  const trackingProduct = {
    id: product.id,
    title: product.name || product.title,
    price: parseFloat(product.price?.toString() || '0'),
    category: product.category || 'uncategorized'
  };

  return (
    <ProductViewTracker product={trackingProduct} viewType="detail">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <EngagementTracker engagementType="image_interaction" elementId="product-gallery">
            <Gallery images={product.images} />
          </EngagementTracker>
        </div>
        <div className="basis-full lg:basis-2/6">
          {/* The dynamic component is now correctly used inside a Client Component */}
          <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />}>
            <ProductDescription product={product} />
          </Suspense>
        </div>
      </div>
    </ProductViewTracker>
  );
}