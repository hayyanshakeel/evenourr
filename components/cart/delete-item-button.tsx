// FILE: components/cart/delete-item-button.tsx

'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/components/cart/cart-context';
import type { CartItem } from 'lib/shopify/types';

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => removeFromCart(item)}
      aria-label="Remove cart item"
      className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500 text-white transition-all duration-200 hover:bg-neutral-700"
    >
      <XMarkIcon className="h-3 w-3" />
    </button>
  );
}
