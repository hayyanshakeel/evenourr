'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { updateItemQuantity } from 'components/cart/actions';
import { useFormState, useFormStatus } from 'react-dom';
import clsx from 'clsx';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Decrease item quantity'}
      aria-disabled={pending}
      className={clsx(
        'ease-in-out duration-150',
        { 'cursor-not-allowed': pending }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon className="h-4 w-4 text-gray-500" />
      ) : (
        <MinusIcon className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({ item, type }: { item: any; type: 'plus' | 'minus' }) {
  const [message, formAction] = useFormState(updateItemQuantity, null);
  const payload = {
    lineId: item.id,
    variantId: item.merchandise.id,
    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
  };
  const actionWithVariant = formAction.bind(null, payload);

  return (
    <form action={actionWithVariant}>
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}