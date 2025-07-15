// components/product/variant-selector.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import type { ProductOption } from 'lib/shopify/types';
import React, { Fragment, useState } from 'react';

// This maps a color name to a Tailwind CSS background color class.
// It now correctly uses `bg-beige-200` from your project's configuration.
const colorNameToClass: { [key: string]: string } = {
  black: 'bg-black',
  white: 'bg-white',
  beige: 'bg-beige-200'
};

export function VariantSelector({ options }: { options: ProductOption[] }) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);

  // Find the color and size options from the product data
  const colorOption = options.find((opt) => opt.name.toLowerCase() === 'color');
  const sizeOption = options.find((opt) => opt.name.toLowerCase() === 'size');

  return (
    <div className="space-y-6">
      {/* --- COLOR SWATCHES --- */}
      {colorOption && (
        <div>
          {/* Display the selected color name, matching your example image */}
          <p className="font-semibold uppercase">{state.color || ''}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {colorOption.values.map((value) => {
              const isActive = state.color === value;
              // Use the color map, with a fallback for unknown colors
              const colorClass = colorNameToClass[value.toLowerCase()] || 'bg-gray-200';

              return (
                <button
                  key={value}
                  onClick={() => {
                    const newState = updateOption('color', value);
                    updateURL(newState);
                  }}
                  title={value}
                  className={clsx(
                    'h-8 w-8 rounded-full border border-neutral-300 transition-transform hover:scale-110',
                    colorClass,
                    // Add a more prominent ring for the active state
                    { 'ring-2 ring-blue-600 ring-offset-2': isActive }
                  )}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* --- SIZE SELECTOR --- */}
      {sizeOption && (
        <div>
          <button
            onClick={() => setIsSizeSelectorOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-300 p-3 text-sm"
          >
            {/* The button text is now static as per your example */}
            <span>Select Size</span>
            <svg
              className="h-5 w-5 rotate-90 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* This is your existing modal from Headless UI */}
          <Transition show={isSizeSelectorOpen} as={Fragment}>
            <Dialog onClose={() => setIsSizeSelectorOpen(false)} className="relative z-50">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <div className="fixed inset-x-0 bottom-0">
                  <Dialog.Panel className="w-full rounded-t-lg bg-white p-4">
                    <div className="flex items-center justify-between pb-4">
                      <Dialog.Title className="text-lg font-semibold">Select Size</Dialog.Title>
                      <button onClick={() => setIsSizeSelectorOpen(false)}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {sizeOption.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => {
                            const newState = updateOption('size', value);
                            updateURL(newState);
                            setIsSizeSelectorOpen(false);
                          }}
                          className="rounded-md border border-gray-300 p-3 text-center text-sm"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>
        </div>
      )}
    </div>
  );
}