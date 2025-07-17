'use client';

import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
      (accumulator: { [key:string]: string }, option: { name: string; value: string }) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value
      }),
      {}
    )
  }));

  // Find the color option
  const colorOption = options.find(option => option.name.toLowerCase() === 'color');

  if (!colorOption) {
    return null;
  }
  
  const optionNameLowerCase = colorOption.name.toLowerCase();
  const selectedColor = searchParams.get(optionNameLowerCase) || colorOption.values[0];

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-medium uppercase text-gray-800">
        {colorOption.name}: <span className="font-semibold">{selectedColor}</span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {colorOption.values.map((value: string) => {
          const optionSearchParams = new URLSearchParams(searchParams.toString());
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          const isAvailable = combinations.some(
            (combination) =>
              combination[optionNameLowerCase] === value && combination.availableForSale
          );

          const isActive = searchParams.get(optionNameLowerCase) === value;
          const colorMap: { [key: string]: string } = {
              black: '#000000', white: '#FFFFFF', brown: '#A52A2A', 
              beige: '#F5F5DC', blue: '#ADD8E6', green: '#90EE90', red: '#FFC0CB',
          };
          const backgroundColor = colorMap[value.toLowerCase()] || value.toLowerCase();

          return (
            <button
              key={value}
              aria-disabled={!isAvailable}
              disabled={!isAvailable}
              onClick={() => router.replace(optionUrl, { scroll: false })}
              title={`${colorOption.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'h-10 w-10 rounded-full border-2 transition-all duration-200',
                {
                  'border-black': isActive,
                  'border-gray-200': !isActive,
                  'cursor-not-allowed opacity-50': !isAvailable,
                }
              )}
              style={{ backgroundColor }}
            />
          );
        })}
      </div>
    </div>
  );
}