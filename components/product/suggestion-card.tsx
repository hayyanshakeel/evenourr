// components/product/suggestion-card.tsx

import { Product } from '@/lib/shopify/types';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../price';

// A helper to calculate the discount percentage
const getDiscountPercentage = (original: number, discounted: number) => {
  if (original <= discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

export function SuggestionCard({ product }: { product: Product }) {
  // Check for a compare-at price to determine if the product is on sale
  const originalPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const compareAtPrice = parseFloat(product.compareAtPriceRange?.maxVariantPrice.amount || '0');
  const isOnSale = compareAtPrice > originalPrice;
  const discount = getDiscountPercentage(compareAtPrice, originalPrice);

  return (
    <Link href={`/product/${product.handle}`} className="group block">
      {/* Image Container */}
      <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          width={400}
          height={500}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Discount Badge */}
        {isOnSale && discount > 0 && (
          <div className="absolute top-3 left-3 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </div>
        )}
        {/* Add to Bag Icon */}
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ShoppingBagIcon className="h-5 w-5" />
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="truncate text-sm font-medium text-gray-800">{product.title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <Price
            className="text-base font-semibold text-black"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
          {isOnSale && (
            <Price
              className="text-sm text-gray-500 line-through"
              amount={product.compareAtPriceRange.maxVariantPrice.amount}
              currencyCode={product.compareAtPriceRange.maxVariantPrice.currencyCode}
            />
          )}
        </div>
        {/* Color Swatches */}
        <div className="mt-2 flex space-x-1">
          {product.variants.slice(0, 4).map((variant) => {
            const color = variant.selectedOptions.find(
              (opt) => opt.name.toLowerCase() === 'color'
            )?.value;
            if (!color) return null;

            const colorMap: { [key: string]: string } = {
              black: '#000000', white: '#FFFFFF', brown: '#8B4513', 
              beige: '#E8DFCF', blue: '#3b82f6', green: '#22c55e', red: '#ef4444',
            };
            const backgroundColor = colorMap[color.toLowerCase()] || color.toLowerCase();

            return (
              <div
                key={variant.id}
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor }}
                title={color}
              />
            );
          })}
        </div>
        {/* Promotional Banner */}
        <div className="mt-3">
          <p className="text-xs font-bold text-blue-600">2 FOR 20% OFF, 3 FOR 30% OFF ›</p>
        </div>
      </div>
    </Link>
  );
}
