'use client';

import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

export function VariantSelector({ options, variants }: { options: ProductOption[]; variants: ProductVariant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  return options.map((option) => (
    <dl className="mb-4" key={option.id}>
      <dt className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-800">{option.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();
          const optionSearchParams = new URLSearchParams(searchParams.toString());
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const isAvailable = combinations.some(
            (combination) =>
              combination[optionNameLowerCase] === value && combination.availableForSale
          );

          const isActive = searchParams.get(optionNameLowerCase) === value;

          return (
            <button
              key={value}
              aria-disabled={!isAvailable}
              disabled={!isAvailable}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'flex items-center justify-center rounded-md border text-sm transition-all duration-200',
                {
                  'cursor-default ring-2 ring-blue-600 ring-offset-2': isActive,
                  'cursor-not-allowed bg-neutral-100 text-gray-400': !isAvailable,
                  'hover:border-blue-600': isAvailable && !isActive,
                  // Style for Size buttons
                  'min-w-[48px] px-3 py-2': optionNameLowerCase !== 'color',
                  // Style for Color swatches
                  'h-9 w-9 p-0': optionNameLowerCase === 'color'
                }
              )}
              // Apply background color for color swatches, if applicable
              style={
                optionNameLowerCase === 'color'
                  ? { backgroundColor: value.toLowerCase() }
                  : {}
              }
            >
              {optionNameLowerCase === 'color' ? '' : value}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}