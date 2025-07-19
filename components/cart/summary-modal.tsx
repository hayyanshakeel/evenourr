// FILE: components/cart/summary-modal.tsx

'use client';

import Price from '@/components/price';
import { Cart } from '@/lib/shopify/types';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Fragment } from 'react';

export function SummaryModal({
  isOpen,
  onClose,
  cart
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart | undefined;
}) {
  if (!cart) return null;

  const dynamicHeight = 220 + cart.lines.length * 80; // Adjusted base height for tax line

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[51]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <Dialog.Panel
            className="fixed bottom-0 left-0 right-0 w-full rounded-t-2xl bg-white transition-all"
            style={{ height: `${Math.min(dynamicHeight, window.innerHeight * 0.8)}px` }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Summary</h2>
                <button onClick={onClose}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4 h-[calc(100%-180px)] space-y-4 overflow-y-auto">
                {cart.lines.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md border">
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.merchandise.product.title}</p>
                      <p className="text-sm text-gray-500">{item.merchandise.title}</p>
                    </div>
                    <Price
                      amount={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 w-full border-t bg-white p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <Price
                    amount={cart.cost.subtotalAmount.amount}
                    currencyCode={cart.cost.subtotalAmount.currencyCode}
                  />
                </div>
                {/* Displaying Taxes */}
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <Price
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <div className="flex justify-between font-bold">
                  <span>Estimated Total</span>
                  <Price
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Shipping fees are calculated on the checkout page.
                </p>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}