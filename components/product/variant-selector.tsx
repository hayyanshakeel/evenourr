'use client';

import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({ options, variants }: { options: ProductOption[]; variants: ProductVariant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return options.map((option: ProductOption) => (
    <div key={option.id} className="mb-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-800">
        {option.name}
      </h3>
      <div className="flex flex-wrap gap-3">
        {option.values.map((value: string) => {
          const optionNameLowerCase = option.name.toLowerCase();
          const optionSearchParams = new URLSearchParams(searchParams.toString());
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const isAvailable = combinations.some(
            (combination) =>
              combination[optionNameLowerCase] === value && combination.availableForSale
          );

          const isActive = searchParams.get(optionNameLowerCase) === value;

          const colorMap: { [key: string]: string } = {
            black: '#000000',
            white: '#ffffff',
            beige: '#f5f5dc'
          };
          const backgroundColor = colorMap[value.toLowerCase()] || value.toLowerCase();

          // FIX: Add the 'return' keyword here
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
                'flex items-center justify-center rounded-md border text-sm font-medium transition-all duration-200 ease-in-out',
                {
                  'cursor-not-allowed': !isAvailable,
                  'hover:border-black': isAvailable && !isActive,
                  'bg-black text-white border-black': isActive && optionNameLowerCase !== 'color',
                  'bg-white text-black border-gray-300': !isActive && optionNameLowerCase !== 'color',
                  'relative bg-white text-gray-300 border-gray-200 after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-rotate-12 after:bg-gray-300 after:content-[""]':
                    !isAvailable && optionNameLowerCase !== 'color',
                  'ring-2 ring-black ring-offset-2': isActive && optionNameLowerCase === 'color',
                  'border-gray-200': !isActive && optionNameLowerCase === 'color',
                  'px-4 py-2': optionNameLowerCase !== 'color',
                  'h-8 w-8': optionNameLowerCase === 'color'
                }
              )}
              style={optionNameLowerCase === 'color' ? { backgroundColor } : {}}
            >
              {optionNameLowerCase === 'color' ? '' : value}
            </button>
          );
        })}
      </div>
    </div>
  ));
}