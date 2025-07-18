// FILE: components/product/you-may-also-like.tsx

import { Product } from '@/lib/shopify/types';
import { SuggestionCard } from './suggestion-card';

export function YouMayAlsoLike({
  products,
  onQuickView
}: {
  products: Product[];
  onQuickView: (product: Product) => void;
}) {
  if (!products.length) return null;

  return (
    <div className="pb-12">
      <h2 className="mb-8 text-center text-lg font-bold uppercase tracking-wider text-black">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {products.map((product) => (
          <SuggestionCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </div>
  );
}