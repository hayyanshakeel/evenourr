'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from 'components/cart/cart-context';

export function DeleteItemButton({ item }: { item: { id: number } }) {
  const { removeItem, loading } = useCart();

  return (
    <button
      aria-label="Remove cart item"
      onClick={() => removeItem(item.id)}
      disabled={loading}
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500 disabled:opacity-50"
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}
