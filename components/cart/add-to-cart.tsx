'use client';

import { useCart } from '@/components/cart/cart-context';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/lib/shopify/types';
import { clsx } from 'clsx';
import { useProduct } from '@/components/product/product-context';
import { useFormStatus } from 'react-dom';

export function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { selectedVariantId } = useProduct();
  const { pending } = useFormStatus();

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
      disabled={!product.availableForSale || pending}
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