'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from 'components/cart/cart-context';

export function EditItemQuantityButton({
  item,
  type
}: {
  item: { id: number; quantity: number };
  type: 'plus' | 'minus';
}) {
  const { updateItemQuantity, loading } = useCart();

  return (
    <button
      type="submit"
      onClick={() => {
        if (type === 'plus') {
          updateItemQuantity(item.id, item.quantity + 1);
        } else {
          updateItemQuantity(item.id, item.quantity - 1);
        }
      }}
      disabled={loading}
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'ml-auto': type === 'minus',
          'cursor-not-allowed': loading
        }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
