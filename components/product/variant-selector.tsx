// FILE: components/product/variant-selector.tsx

'use client';

import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
  onOpenSizeSelector
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  onOpenSizeSelector: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [pendingColor, setPendingColor] = useState<string | null>(null);

  useEffect(() => {
    if (pendingColor && searchParams.get('color') === pendingColor) {
      setPendingColor(null);
    }
  }, [searchParams, pendingColor]);

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator: { [key: string]: string }, option: { name: string; value: string }) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value
      }),
      {}
    )
  }));

  useEffect(() => {
    const colorOption = options.find((option) => option.name.toLowerCase() === 'color');
    const hasColorParam = searchParams.has('color');

    if (colorOption && !hasColorParam && colorOption.values.length > 0) {
      const firstColor = colorOption.values[0];
      if (firstColor) {
        const optionSearchParams = new URLSearchParams(searchParams.toString());
        optionSearchParams.set('color', firstColor);
        router.replace(createUrl(pathname, optionSearchParams), { scroll: false });
      }
    }
  }, [options, searchParams, router, pathname]);

  const sortedOptions = [...options].sort((a, b) => {
    if (a.name.toLowerCase() === 'color') return -1;
    if (b.name.toLowerCase() === 'color') return 1;
    return 0;
  });

  return (
    <div className="flex flex-col">
      {sortedOptions.map((option) => {
        const optionNameLowerCase = option.name.toLowerCase();

        if (optionNameLowerCase === 'color') {
          const selectedColor = searchParams.get('color');
          return (
            <div key={option.id}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {selectedColor || option.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value: string) => {
                  const optionSearchParams = new URLSearchParams(searchParams.toString());
                  optionSearchParams.set(optionNameLowerCase, value);
                  const optionUrl = createUrl(pathname, optionSearchParams);
                  const isAvailable = combinations.some(
                    (combination) =>
                      combination[optionNameLowerCase] === value && combination.availableForSale
                  );
                  const isActive = (pendingColor || selectedColor) === value;
                  const colorMap: { [key: string]: string } = { black: '#000000', white: '#FFFFFF', brown: '#8B4513', beige: '#E8DFCF', blue: '#3b82f6', green: '#22c55e', red: '#ef4444' };
                  const backgroundColor = colorMap[value.toLowerCase()] || value.toLowerCase();

                  const handleColorClick = () => {
                    setPendingColor(value);
                    router.replace(optionUrl, { scroll: false });
                  };

                  return (
                    <button
                      key={value}
                      aria-disabled={!isAvailable}
                      disabled={!isAvailable}
                      onClick={handleColorClick}
                      title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
                      className={clsx('h-6 w-6 rounded-full border border-neutral-200 transition-all duration-200 ease-in-out', {
                        'ring-2 ring-black ring-offset-1': isActive,
                        'cursor-not-allowed opacity-50': !isAvailable,
                      })}
                      style={{ backgroundColor }}
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        if (optionNameLowerCase === 'size') {
          const selectedSize = searchParams.get('size');
          return (
            <div key={option.id} className="mt-6">
              <button
                onClick={onOpenSizeSelector}
                // FIX: Increased vertical padding from py-2.5 to py-3
                className="flex w-full items-center justify-between border border-black px-4 py-3 text-sm font-medium text-black"
              >
                <span>{selectedSize || 'Select Size'}</span>
                <ChevronRightIcon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}