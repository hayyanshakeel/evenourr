// FILE: components/product/quick-view.tsx

'use client';

import { AddToCart } from '@/components/cart/add-to-cart';
import { ProductProvider } from '@/components/product/product-context';
import { VariantSelector } from '@/components/product/variant-selector';
import type { Product } from '@/lib/shopify/types';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import Price from '../price';

export function QuickView({
  product,
  onClose,
  onOpenSizeSelector
}: {
  product: Product | null;
  onClose: () => void;
  onOpenSizeSelector: () => void;
}) {
  const isOpen = !!product;
  const searchParams = useSearchParams();
  const selectedSize = searchParams.get('size');

  if (!product) {
    return null;
  }
  
  const handleSelectSizeClick = () => {
    onClose(); // Close this panel first
    onOpenSizeSelector(); // Then open the main size selector panel
  };

  // We only want to show the color options in this panel
  const colorOptions = product.options.filter(option => option.name.toLowerCase() === 'color');

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
            <Dialog.Panel className="h-auto max-h-[90vh] w-full rounded-t-lg bg-white">
              {/* ProductProvider is crucial for child components to work */}
              <ProductProvider product={product}>
                <div className="flex h-full flex-col">
                  <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} aria-label="Close panel">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-6">
                    {product.featuredImage && (
                       <div className="aspect-square w-full">
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || 'Product image'}
                            width={800}
                            height={800}
                            className="h-full w-full object-cover"
                          />
                        </div>
                    )}
                    <div className="mt-4">
                      <h3 className="font-semibold">{product.title}</h3>
                      <Price
                        className="mt-1 text-lg"
                        amount={product.priceRange.maxVariantPrice.amount}
                        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <VariantSelector options={colorOptions} variants={product.variants} onOpenSizeSelector={() => {}} />
                    </div>

                    <div className="mt-6">
                       <button
                        onClick={handleSelectSizeClick}
                        className="flex w-full items-center justify-between border border-black px-4 py-3 text-sm font-medium text-black"
                      >
                        <span>{selectedSize || 'Select Size'}</span>
                        <ChevronRightIcon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                      </button>
                    </div>

                  </div>

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