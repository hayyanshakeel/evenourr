'use client';

import { useCart } from '@/components/cart/cart-context';
import { useProduct } from '@/components/product/product-context';
import type { Product } from '@/lib/shopify/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { selectedVariantId } = useProduct();
  // We don't use useFormStatus as we are not in a form
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
        'flex w-full items-center justify-center gap-x-2 rounded-lg bg-black px-5 py-3 text-white transition-colors duration-200 ease-in-out hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-neutral-400'
      )}
    >
      <PlusIcon className="h-5 w-5" />
      <span>{product.availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
    </button>
  );
}