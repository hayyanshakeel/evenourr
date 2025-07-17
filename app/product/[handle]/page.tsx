// app/product/[handle]/page.tsx

import { getProduct, getProductRecommendations } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductPageClient } from './client';

// This is a Server Component. It can be async.
export default async function ProductPage({ params }: { params: { handle: string } }) {
  // Fetch only the data needed for this page.
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  // The footer menu is handled by the root layout, so we only fetch recommendations here.
  const recommendations = await getProductRecommendations(product.id);

  // Render the Client Component and pass only the relevant data.
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ProductPageClient
        product={product}
        recommendations={recommendations}
      />
    </Suspense>
  );
}
