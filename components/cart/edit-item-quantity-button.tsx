'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/components/cart/cart-context';
import type { CartItem } from 'lib/shopify/types';

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate?: boolean;
}) {
  const { updateCartItemQuantity } = useCart();

  function handleUpdate() {
    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity >= 0) { // Allow quantity to be 0 for removal
      updateCartItemQuantity(item.id, newQuantity);
    }
  }

  return (
    <button
      type="button"
      onClick={handleUpdate}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Decrease item quantity'}
      className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80"
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}
