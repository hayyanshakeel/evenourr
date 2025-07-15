'use client';

import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { ProductOption } from 'lib/shopify/types';
import { Fragment, useState } from 'react';

const colorNameToClass: { [key: string]: string } = {
  black: 'bg-black',
  white: 'bg-white',
  beige: 'bg-beige-200',
};

export function VariantSelector({ options }: { options: ProductOption[] }) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const optionNameLowerCase = option.name.toLowerCase();

        if (optionNameLowerCase === 'color') {
          return (
            <div key={option.id}>
              <p className="mb-2 text-sm font-semibold">
                {option.name}: <span className="font-normal">{state.color}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const isActive = state.color === value;
                  const colorClass = colorNameToClass[value.toLowerCase()] || 'bg-gray-400';

                  return (
                    <button
                      key={value}
                      onClick={() => {
                        const newState = updateOption(optionNameLowerCase, value);
                        updateURL(newState);
                      }}
                      title={value}
                      className={clsx(
                        'h-8 w-8 rounded-full border border-gray-200',
                        colorClass,
                        { 'ring-2 ring-black ring-offset-2': isActive }
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        if (optionNameLowerCase === 'size') {
          return (
            <div key={option.id}>
              {/* Size Title and Guide Link */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">SIZE</p>
                <a href="#" className="text-xs font-medium text-gray-500 hover:underline">
                  Size Guide
                </a>
              </div>
              <button
                onClick={() => setIsSizeSelectorOpen(true)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 p-3 text-sm"
              >
                <span>{state.size || 'Select Size'}</span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" />
                </svg>
              </button>

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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {option.values.map((value) => (
                            <button
                              key={value}
                              onClick={() => {
                                const newState = updateOption(optionNameLowerCase, value);
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
          );
        }

        return null;
      })}
    </div>
  );
}