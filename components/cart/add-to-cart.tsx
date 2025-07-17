'use client';

import { useCart } from '@/components/cart/cart-context';
import { useProduct } from '@/components/product/product-context';
import type { Product } from '@/lib/shopify/types';
import { clsx } from 'clsx';

export function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { selectedVariantId } = useProduct();
  const isDisabled = !product.availableForSale || !selectedVariantId;

  const handleAddToCart = () => {
    if (!selectedVariantId) {
      alert('Please select a variant.');
      return;
    }
    addToCart(selectedVariantId);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      aria-label="Add to cart"
      className={clsx(
        'flex w-full items-center justify-center rounded-md bg-black px-5 py-4 text-sm font-semibold uppercase text-white transition-colors duration-200 ease-in-out hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-neutral-500'
      )}
    >
      <span>{product.availableForSale ? 'Add to Bag' : 'Out Of Stock'}</span>
    </button>
  );
}