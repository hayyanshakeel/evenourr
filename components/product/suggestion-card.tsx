// FILE: components/product/suggestion-card.tsx

import { Product } from '@/lib/shopify/types';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../price';

const getDiscountPercentage = (original: number, discounted: number) => {
  if (original <= discounted || original === 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

export function SuggestionCard({
  product,
  onQuickView
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  const compareAtPriceString = product.compareAtPriceRange?.maxVariantPrice?.amount;
  const originalPriceString = product.priceRange.maxVariantPrice.amount;
  const compareAtPrice = compareAtPriceString ? parseFloat(compareAtPriceString) : 0;
  const originalPrice = parseFloat(originalPriceString);
  const isOnSale = compareAtPrice > originalPrice;
  const discount = getDiscountPercentage(compareAtPrice, originalPrice);

  const uniqueColors = Array.from(
    new Set(
      product.variants
        .map((variant) =>
          variant.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color')
        )
        .filter((opt): opt is { name: string; value: string } => !!opt)
        .map((opt) => opt.value)
    )
  );
  
  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div className="group block">
      <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
        <Link href={`/product/${product.handle}`} className="absolute inset-0 z-10" />

        {product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}

        {isOnSale && discount > 0 && (
          <div className="absolute top-3 left-3 z-20 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </div>
        )}

        {/* FIX: Corrected button styling to ensure icon is always visible and styled correctly */}
        <button
          onClick={handleQuickViewClick}
          aria-label="Quick Shop"
          className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105"
        >
          <ShoppingBagIcon className="h-5 w-5 text-black" />
        </button>
      </div>

      <div>
        <h3 className="truncate text-sm font-medium text-gray-800">{product.title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <Price
            className="text-base font-semibold text-black"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
          {isOnSale && product.compareAtPriceRange && (
            <Price
              className="text-sm text-gray-500 line-through"
              amount={product.compareAtPriceRange.maxVariantPrice.amount}
              currencyCode={product.compareAtPriceRange.maxVariantPrice.currencyCode}
            />
          )}
        </div>
        <div className="mt-2 flex space-x-1">
          {uniqueColors.slice(0, 4).map((color) => {
            const colorMap: { [key: string]: string } = { black: '#000000', white: '#FFFFFF', brown: '#8B4513', beige: '#E8DFCF', blue: '#3b82f6', green: '#22c55e', red: '#ef4444' };
            const backgroundColor = colorMap[color.toLowerCase()] || color.toLowerCase();
            return (
              <div
                key={color}
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor }}
                title={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}