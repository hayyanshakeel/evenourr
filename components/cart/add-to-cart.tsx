'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from 'components/cart/cart-context';
import { useProduct } from 'components/product/product-context';
import { useState } from 'react';
import LoadingDots from '../loading-dots';

export function AddToCart({ product }: { product: { id: number, inventory: number } }) {
  const { addToCart, loading: isCartLoading } = useCart();
  const { state } = useProduct(); // For variant selection if you add it later
  const [isAdding, setIsAdding] = useState(false);

  // This is a placeholder for variant logic.
  // For now, we assume no variants and use the main product ID.
  const selectedVariantId = product.id; // Or logic to find variant ID
  const availableForSale = product.inventory > 0;

  const handleAddToCart = async () => {
    if (!availableForSale || !selectedVariantId) return;
    
    setIsAdding(true);
    await addToCart(selectedVariantId, 1);
    setIsAdding(false);
  };

  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  return (
    <button
      onClick={handleAddToCart}
      aria-label="Add to cart"
      disabled={isAdding || isCartLoading || !availableForSale}
      className={clsx(buttonClasses, {
        'hover:opacity-90': !isAdding && availableForSale,
        [disabledClasses]: isAdding || !availableForSale
      })}
    >
      <div className="absolute left-0 ml-4">
        {isAdding ? <LoadingDots className="bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      {availableForSale ? 'Add To Cart' : 'Out Of Stock'}
    </button>
  );
}
