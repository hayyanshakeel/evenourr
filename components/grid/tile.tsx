// FILE: components/grid/tile.tsx

import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/lib/shopify/types';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  product,
  onQuickView,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
  product?: Product;
  onQuickView?: (product: Product) => void;
} & React.ComponentProps<typeof Image>) {
  
  const handleQuickViewClick = (e: React.MouseEvent) => {
    if (!onQuickView || !product) return;
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}

      {onQuickView && product && (
         <button
          onClick={handleQuickViewClick}
          aria-label="Quick Shop"
          // FIX: Standardized the button style to be always visible and match the other cards.
          className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105"
        >
          <ShoppingBagIcon className="h-5 w-5 text-black" />
        </button>
      )}
    </div>
  );
}