// FILE: components/product/quick-view.tsx

'use client';

import { useCart } from '@/components/cart/cart-context';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import Price from '../price';

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const isOpen = !!product;
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product) {
      const defaultColor = product.variants[0]?.selectedOptions.find(opt => opt.name.toLowerCase() === 'color')?.value;
      setSelectedColor(defaultColor || null);
      setSelectedSize(null);
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variant = product.variants.find(v => {
        const hasColor = v.selectedOptions.some(opt => opt.name.toLowerCase() === 'color' && opt.value === selectedColor);
        const hasSize = v.selectedOptions.some(opt => opt.name.toLowerCase() === 'size' && opt.value === selectedSize);
        return hasColor && hasSize;
      });
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [product, selectedColor, selectedSize]);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (selectedVariant?.availableForSale) {
      addToCart(selectedVariant.id);
      onClose();
    }
  };
  
  const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
  const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');

  const colorMap: { [key: string]: string } = {
    black: '#000000',
    white: '#FFFFFF',
    brown: '#A0522D',
    beige: '#F5F5DC',
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="ease-in duration-200" leaveFrom="translate-y-0" leaveTo="translate-y-full">
          <div className="fixed inset-x-0 bottom-0">
            {/* FIX: Add 'relative' to the panel to contain the absolute positioned footer */}
            <Dialog.Panel className="relative h-auto max-h-[90vh] w-full rounded-t-lg bg-white">
                <div className="absolute top-4 right-4 z-20">
                  <button onClick={onClose} aria-label="Close panel"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                
                {/* FIX: Add significant bottom padding (pb-24) to the scrollable area */}
                <div className="h-full max-h-[90vh] overflow-y-auto px-6 pt-6 pb-24">
                  <Dialog.Title className="text-xl font-semibold uppercase">Product Detail</Dialog.Title>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {product.images.slice(0, 2).map((image) => (
                      <div key={image.url} className="aspect-[2/3] w-full"><Image src={image.url} alt={image.altText || 'Product image'} width={400} height={600} className="h-full w-full object-cover" /></div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <Price className="mt-1 text-lg" amount={product.priceRange.maxVariantPrice.amount} currencyCode={product.priceRange.maxVariantPrice.currencyCode} />
                    </div>
                    <Link href={`/product/${product.handle}`} className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold uppercase">See Details <ChevronRightIcon className="h-4 w-4" /></Link>
                  </div>
                  
                  {colorOption && (
                    <div className="mt-6">
                      <h4 className="font-semibold uppercase">{selectedColor || colorOption.name}</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {colorOption.values.map(value => {
                          const colorValue = colorMap[value.toLowerCase()] || value.toLowerCase();
                          return (
                            <button key={value} onClick={() => setSelectedColor(value)} className={clsx('h-12 w-10 rounded-md border-2 p-0.5', { 'border-black': selectedColor === value, 'border-gray-200': selectedColor !== value })}>
                              <div className="h-full w-full rounded-[4px]" style={{ backgroundColor: colorValue }}></div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {sizeOption && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold uppercase">{sizeOption.name}</h4>
                        <a href="#" className="flex items-center gap-1 text-sm font-semibold uppercase">Size Guide & Model Info <ChevronRightIcon className="h-4 w-4" /></a>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {sizeOption.values.map(value => {
                          const isAvailable = product.variants.some(v => v.selectedOptions.some(opt => opt.value === value) && v.availableForSale);
                          return (
                            <button key={value} onClick={() => setSelectedSize(value)} disabled={!isAvailable} className={clsx('rounded-lg border py-2 text-sm', { 'bg-black text-white border-black': selectedSize === value, 'bg-gray-100 text-gray-400 cursor-not-allowed': !isAvailable, 'border-gray-300': selectedSize !== value && isAvailable })}>{value}</button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* FIX: Position the footer absolutely to the bottom of the panel */}
                <div className="absolute bottom-0 left-0 z-10 w-full flex-shrink-0 border-t bg-white p-4">
                  <button onClick={handleAddToCart} disabled={!selectedVariant?.availableForSale} className="flex w-full items-center justify-center rounded-full bg-black py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                    {selectedVariant ? (selectedVariant.availableForSale ? 'Add to Bag' : 'Out of Stock') : 'Select Size'}
                  </button>
                </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}