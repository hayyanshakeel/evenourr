'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { removeItem } from 'components/cart/actions';
import { useFormState, useFormStatus } from 'react-dom';
import clsx from 'clsx';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Remove cart item"
      aria-disabled={pending}
      className={clsx(
        'ease-in-out duration-150',
        { 'cursor-not-allowed px-0': pending }
      )}
    >
      <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-gray-800" />
    </button>
  );
}

export function DeleteItemButton({ item }: { item: any }) {
  const [message, formAction] = useFormState(removeItem, null);
  const itemId = item.id;
  const actionWithVariant = formAction.bind(null, itemId);

  return (
    <form action={actionWithVariant}>
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}