'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';

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

  // Sort options to ensure "Size" comes before "Color"
  const sortedOptions = [...options].sort((a, b) => {
    if (a.name.toLowerCase() === 'size') return -1;
    if (b.name.toLowerCase() === 'size') return 1;
    return 0;
  });

  return sortedOptions.map((option) => {
    const optionNameLowerCase = option.name.toLowerCase();

    // UI for Size Selector Dropdown
    if (optionNameLowerCase === 'size') {
      const selectedSize = searchParams.get('size');
      return (
        <div key={option.id} className="mb-6">
          <Menu as="div" className="relative block text-left">
            <div>
              <Menu.Button className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <span>{selectedSize || 'Select Size'}</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                'bg-gray-100 text-gray-900': active,
                                'text-gray-700': !active,
                                'cursor-not-allowed text-gray-400': !isAvailable,
                              }
                            )}
                          >
                            {value}
                            {!isAvailable && <span className="ml-2 text-gray-400">(Out of stock)</span>}
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
    
    // UI for Color Swatches
    if (optionNameLowerCase === 'color') {
      return (
        <div key={option.id} className="mb-4">
          <h3 className="mb-3 text-sm font-bold uppercase text-black">
            {option.name}
          </h3>
          <div className="flex flex-wrap gap-4">
            {option.values.map((value: string) => {
              const optionSearchParams = new URLSearchParams(searchParams.toString());
              optionSearchParams.set(optionNameLowerCase, value);
              const optionUrl = createUrl(pathname, optionSearchParams);

              const isAvailable = combinations.some(
                (combination) =>
                  combination[optionNameLowerCase] === value && combination.availableForSale
              );
              
              const isActive = searchParams.get(optionNameLowerCase) === value;

              // This map translates color names from Shopify into CSS hex codes.
              // For 100% accuracy, the best practice is to store hex codes in Shopify
              // directly, using either metafields or by naming the variant option
              // like "Saddle Brown #8B4513" and then parsing the hex code here.
              const colorMap: { [key: string]: string } = {
                black: '#000000',
                white: '#FFFFFF',
                brown: '#8B4513', // Using "SaddleBrown" for "Brown"
                beige: '#E8DFCF',
                blue: '#3b82f6', // A nicer blue
                green: '#22c55e', // A nicer green
                red: '#ef4444', // A nicer red
              };
              const backgroundColor = colorMap[value.toLowerCase()] || value.toLowerCase();

              return (
                <button
                  key={value}
                  aria-disabled={!isAvailable}
                  disabled={!isAvailable}
                  onClick={() => router.replace(optionUrl, { scroll: false })}
                  title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
                  className={clsx(
                    'h-10 w-10 rounded-full border-2 border-white transition-all duration-200',
                    {
                      'ring-2 ring-black ring-offset-2': isActive,
                      'cursor-not-allowed opacity-50': !isAvailable,
                    }
                  )}
                  style={{ backgroundColor }}
                />
              );
            })}
          </div>
        </div>
      )
    }

    return null;
  });
}