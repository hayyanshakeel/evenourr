'use client';

import { Product } from 'lib/shopify/types';
import { SuggestionCard } from './suggestion-card';

interface YouMayAlsoLikeProps {
    products: Product[];
    // --- FIX: The function signature was updated here ---
    // The original `onQuickView` passed a `product` argument, but the
    // `SuggestionCard` component expects a function with no arguments.
    // The logic should handle which product to show inside the function itself,
    // possibly by using the `product` from the map's scope.
    onQuickView: (product: Product) => void;
}

export default function YouMayAlsoLike({ products, onQuickView }: YouMayAlsoLikeProps) {
    if (!products.length) return null;

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <SuggestionCard
                            key={product.handle}
                            product={product}
                            // The function passed now correctly matches the expected type '() => void'
                            onQuickView={() => onQuickView(product)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}