'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isPending,
}: {
  availableForSale: boolean;
  selectedVariantId?: number;
  isPending: boolean;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={`${buttonClasses} ${disabledClasses}`}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button aria-disabled className={`${buttonClasses} ${disabledClasses}`}>
        Please select a variant
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      aria-disabled={isPending}
      className={`${buttonClasses} ${isPending ? disabledClasses : ''}`}
    >
      <div className="absolute left-0 ml-4">
        {isPending ? (
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
        ) : (
          <PlusIcon className="h-5" />
        )}
      </div>
      <span>Add To Cart</span>
    </button>
  );
}

export function AddToCart({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId?: number;
}) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedVariantId) return;

    setIsPending(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: selectedVariantId, quantity: 1 }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add item to cart.');
      }

      setMessage('Item added successfully!');
      // You might want to update cart state globally here
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isPending={isPending}
      />
      {message && (
        <p aria-live="polite" className="mt-2 text-sm text-red-500">
          {message}
        </p>
      )}
    </form>
  );
}