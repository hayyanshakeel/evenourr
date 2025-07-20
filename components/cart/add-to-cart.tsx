'use client';

import { addItem } from '@/components/cart/actions';
import { Product } from '@/lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-label="Add to cart"
      disabled={pending || !availableForSale || !selectedVariantId}
      className="w-full rounded-xl bg-black p-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span>{availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();
  const defaultVariantId = product.variants.length === 1 ? product.variants[0]?.id : undefined;
  const variant = product.variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, selectedVariantId);

  return (
    <form action={actionWithVariant}>
      <SubmitButton
        availableForSale={product.availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
