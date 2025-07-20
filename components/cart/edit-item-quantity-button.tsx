// FILE: components/cart/edit-item-quantity-button.tsx

'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/components/cart/cart-context';
import type { CartItem } from 'lib/shopify/types';
import clsx from 'clsx';

export function EditItemQuantityButton({
  item,
  type
}: {
  item: CartItem;
  type: 'plus' | 'minus';
}) {
  const { updateQuantity } = useCart();

  function handleUpdate() {
    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity >= 0) {
      updateQuantity(item, newQuantity);
    }
  }

  return (
    <button
      type="button"
      onClick={handleUpdate}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Decrease item quantity'}
      className={clsx(
        'ease flex h-full w-8 items-center justify-center rounded-full px-2 transition-all duration-200 hover:bg-neutral-100'
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}
