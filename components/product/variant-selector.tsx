'use client';

import { ProductOption, ProductVariant } from '@/lib/shopify/types';
import { createUrl } from '@/lib/utils';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. 'Color': 'Red', 'Size': 'S'
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
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    // Adds key:value for each variant (e.g. 'color': 'Black', 'size': 'M')
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  return options.map((option) => (
    <dl className="mb-8" key={option.id}>
      <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();

          // Base option params on current params so we can preserve things like `q`.
          const optionSearchParams = new URLSearchParams(searchParams.toString());

          // Update the option params using the current option to reflect how the URL would change.
          optionSearchParams.set(optionNameLowerCase, value);
          const optionUrl = createUrl(pathname, optionSearchParams);

          // The current search params has a value for this option, but it's different from the current value.
          const filtered = Array.from(optionSearchParams.keys()).filter(
            (key) => key !== optionNameLowerCase
          );
          const isSelected = searchParams.get(optionNameLowerCase) === value;

          // Find variant combinations that match the current option value.
          const findVariant = combinations.find((combination) =>
            filtered.every(
              (key) => combination[key] === searchParams.get(key) && combination[optionNameLowerCase]
            )
          );

          // Check if the variant is available for sale.
          const isAvailable = findVariant?.availableForSale;

          const DynamicTag = isAvailable ? 'button' : 'p';

          return (
            <DynamicTag
              key={value}
              aria-disabled={!isAvailable}
              disabled={!isAvailable}
              onClick={() => {
                router.replace(optionUrl, { scroll: false });
              }}
              title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                {
                  'cursor-default ring-2 ring-blue-600': isSelected,
                  'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                    !isSelected && isAvailable,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                    !isAvailable
                }
              )}
            >
              {value}
            </DynamicTag>
          );
        })}
      </dd>
    </dl>
  ));
}

