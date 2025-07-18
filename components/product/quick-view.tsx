// FILE: components/product/quick-view.tsx

'use client';

import { AddToCart } from '@/components/cart/add-to-cart';
import { ProductProvider } from '@/components/product/product-context';
import { VariantSelector } from '@/components/product/variant-selector';
import type { Product } from '@/lib/shopify/types';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import Price from '../price';

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const isOpen = !!product;

  if (!product) {
    return null;
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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
          <div className="fixed inset-x-0 bottom-0">
            <Dialog.Panel className="h-auto max-h-[80vh] w-full rounded-t-lg bg-white">
              {/* ProductProvider is crucial for VariantSelector and AddToCart to work */}
              <ProductProvider product={product}>
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="flex flex-shrink-0 items-center justify-between p-4">
                    <Dialog.Title className="text-lg font-semibold uppercase">
                      Product Detail
                    </Dialog.Title>
                    <button onClick={onClose} aria-label="Close panel">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-grow overflow-y-auto px-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      {product.images.slice(0, 2).map((image) => (
                        <div key={image.url} className="aspect-square w-full">
                          <Image
                            src={image.url}
                            alt={image.altText || 'Product image'}
                            width={400}
                            height={400}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/product/${product.handle}`}
                        className="font-semibold hover:underline"
                      >
                        {product.title}
                      </Link>
                      <Price
                        className="mt-1 text-lg"
                        amount={product.priceRange.maxVariantPrice.amount}
                        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                      />
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <VariantSelector options={product.options} variants={product.variants} onOpenSizeSelector={() => {}} />
                    </div>
                  </div>

                  {/* Footer with Add to Bag */}
                  <div className="flex-shrink-0 border-t p-4">
                    <AddToCart product={product} />
                  </div>
                </div>
              </ProductProvider>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}