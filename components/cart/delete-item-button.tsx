'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/components/cart/cart-context';
import type { CartItem } from 'lib/shopify/types';

export function DeleteItemButton({ item, optimisticUpdate }: { item: CartItem; optimisticUpdate?: boolean }) {
  const { removeFromCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => removeFromCart(item.id)}
      aria-label="Remove cart item"
      className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 text-white transition-all duration-200"
    >
      <XMarkIcon className="h-4 w-4" />
    </button>
  );
}
