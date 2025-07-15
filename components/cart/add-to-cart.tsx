'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  // Updated button classes for black background and white text
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-black p-4 text-sm font-semibold tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        ADD TO BAG
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (!availableForSale) e.preventDefault();
      }}
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
    >
      ADD TO BAG
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const defaultVariant = product.variants.length === 1 ? product.variants[0] : undefined;
  const selectedVariant = product.variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );

  const variantToUse = selectedVariant || defaultVariant;
  const selectedVariantId = variantToUse?.id;
  const isAvailableForSale = variantToUse?.availableForSale ?? false;

  const actionWithVariant = formAction.bind(null, selectedVariantId);

  return (
    <form
      action={async () => {
        if (!variantToUse) return;

        addCartItem(variantToUse, product);
        actionWithVariant();
        toast.success('Item added to bag!');
      }}
    >
      <SubmitButton
        availableForSale={isAvailableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}