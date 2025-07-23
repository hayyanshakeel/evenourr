// components/product/variant-selector.tsx

'use client';

import { ProductOption, ProductVariant } from '@/lib/definitions';
import { createUrl } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import clsx from 'clsx';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // e.g. { color: 'Red', size: 'S', availableForSale: true }
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const combinations: Combination[] = useMemo(() => {
    return variants.map((variant) => ({
      id: variant.id,
      availableForSale: variant.availableForSale,
      ...variant.selectedOptions.reduce(
        (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
        {}
      )
    }));
  }, [variants]);

  return options.map((option) => (
    <dl className="mb-8" key={option.name}>
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();
          const optionSearchParams = new URLSearchParams(searchParams.toString());
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const isActive = searchParams.get(optionNameLowerCase) === value;

          // Filter combinations to see which are available for the current option value
          const filteredForAvailability = combinations.filter(
            (combination) => combination[optionNameLowerCase] === value
          );
          
          const isAvailable = filteredForAvailability.some(
            (combination) => combination.availableForSale
          );
          
          const isDisabled = !isAvailable;

          return (
            <button
              key={value}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-4 py-2 text-sm transition-all duration-200',
                {
                  'cursor-not-allowed opacity-50': isDisabled,
                  'ring-2 ring-blue-600': isActive,
                  'hover:border-blue-600': !isDisabled
                }
              )}
            >
              {value}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}