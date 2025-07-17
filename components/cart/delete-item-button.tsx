'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/components/cart/cart-context';
import type { CartItem } from 'lib/shopify/types';
import { useFormStatus } from 'react-dom';

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();
  const { pending } = useFormStatus();

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={pending}
      aria-label="Remove cart item"
      className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 text-white transition-all duration-200"
    >
      {pending ? (
        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
      ) : (
        <XMarkIcon className="h-4 w-4" />
      )}
    </button>
  );
}