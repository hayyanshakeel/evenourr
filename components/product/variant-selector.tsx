// components/product/variant-selector.tsx

'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect } from 'react';

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

  // Automatically select the first color if none is selected in the URL
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
    <div className="flex flex-col gap-y-4">
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
                  const isActive = searchParams.get(optionNameLowerCase) === value;

                  const colorMap: { [key: string]: string } = {
                    black: '#000000', white: '#FFFFFF', brown: '#8B4513', 
                    beige: '#E8DFCF', blue: '#3b82f6', green: '#22c55e', red: '#ef4444',
                  };
                  const backgroundColor = colorMap[value.toLowerCase()] || value.toLowerCase();

                  return (
                    <button
                      key={value}
                      aria-disabled={!isAvailable}
                      disabled={!isAvailable}
                      onClick={() => router.replace(optionUrl, { scroll: false })}
                      title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
                      // FIX: Reduced the size of the color swatches
                      className={clsx(
                        'h-6 w-6 rounded-full border border-neutral-200 transition-all duration-200',
                        {
                          'ring-2 ring-black ring-offset-1': isActive,
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

        if (optionNameLowerCase === 'size') {
          const selectedSize = searchParams.get('size');
          return (
            <div key={option.id}>
              <Menu as="div" className="relative block text-left">
                <div>
                  <Menu.Button className="flex w-full items-center justify-between border border-black px-4 py-2.5 text-sm font-medium text-black">
                    <span>{selectedSize || 'Select Size'}</span>
                    <ChevronRightIcon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {option.values.map((value) => {
                        const optionSearchParams = new URLSearchParams(searchParams.toString());
                        optionSearchParams.set(optionNameLowerCase, value);
                        const optionUrl = createUrl(pathname, optionSearchParams);
                        const isAvailable = combinations.some(
                          (combination) =>
                            combination[optionNameLowerCase] === value && combination.availableForSale
                        );

                        return (
                          <Menu.Item key={value}>
                            {({ active }) => (
                              <button
                                disabled={!isAvailable}
                                onClick={() => router.replace(optionUrl, { scroll: false })}
                                className={clsx(
                                  'block w-full px-4 py-2 text-left text-sm',
                                  {
                                    'bg-neutral-100 text-black': active,
                                    'text-neutral-700': !active,
                                    'cursor-not-allowed text-neutral-400': !isAvailable,
                                  }
                                )}
                              >
                                {value}
                                {!isAvailable && <span className="ml-2 text-neutral-400">(Out of stock)</span>}
                              </button>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
