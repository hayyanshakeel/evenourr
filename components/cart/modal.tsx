// FILE: components/cart/modal.tsx

'use client';

import Price from '@/components/price';
import { useCart } from '@/components/cart/cart-context';
import OpenCart from '@/components/cart/open-cart';
import { YouMayAlsoLike } from '@/components/product/you-may-also-like';
import { Product } from '@/lib/shopify/types';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendedProducts, redirectToCheckout } from './actions';
import { CouponModal } from './coupon-modal';

function CheckoutButton({ totalQuantity }: { totalQuantity: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || totalQuantity === 0}
      className="w-full rounded-full bg-black p-4 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? 'Processing...' : `CHECKOUT (${totalQuantity})`}
    </button>
  );
}

export default function CartModal() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen && cart && cart.lines.length > 0 && recommendations.length === 0) {
      const firstProductId = cart.lines[0]?.merchandise.product.id;
      if (firstProductId) {
        getRecommendedProducts(firstProductId).then(setRecommendations);
      }
    }
    if (isOpen && (!cart || cart.lines.length === 0)) {
      setRecommendations([]);
    }
  }, [isOpen, cart, recommendations.length]);

  useEffect(() => {
    if (cart?.totalQuantity !== quantityRef.current) {
      if (!isOpen && cart?.totalQuantity !== 0) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const checkoutAction = cart ? redirectToCheckout.bind(null, cart.id) : undefined;

  const isDiscountApplied = cart?.discountCodes && cart.discountCodes.length > 0;
  const savedAmount =
    cart && isDiscountApplied
      ? (
          parseFloat(cart.cost.subtotalAmount.amount) - parseFloat(cart.cost.totalAmount.amount)
        ).toFixed(2)
      : '0.00';

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white text-black md:w-[420px]">
              <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                <button onClick={closeCart} className="p-2">
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold">SHOPPING BAG</h1>
                <div className="flex items-center gap-4">
                  <ShareIcon className="h-6 w-6" />
                  <HeartIcon className="h-6 w-6" />
                </div>
              </header>

              <div className="flex-grow overflow-y-auto">
                <main className="p-4">
                  {!cart || cart.lines.length === 0 ? (
                    <div className="mt-20 flex w-full flex-col items-center justify-center">
                      <ShoppingCartIcon className="h-16 text-gray-400" />
                      <p className="mt-6 text-center text-2xl font-bold">Your bag is empty.</p>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-4">
                        {cart.lines.map((item) => (
                          <li key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                            <input
                              type="checkbox"
                              className="mt-1 h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                              defaultChecked
                            />
                            <div className="relative h-28 w-24 flex-shrink-0">
                              <Image
                                src={item.merchandise.product.featuredImage.url}
                                alt={item.merchandise.product.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h3 className="font-semibold">{item.merchandise.product.title}</h3>
                                <HeartIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                              </div>
                              <Price
                                className="mt-1 font-bold"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={item.cost.totalAmount.currencyCode}
                              />
                              <p className="mt-1 text-sm text-gray-500">{item.merchandise.title}</p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 rounded-lg border p-4">
                        <button
                          onClick={() => setIsCouponsOpen(true)}
                          className="flex w-full items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <TagIcon className="h-5 w-5" />
                            <span>Coupons</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isDiscountApplied && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                                PROMO APPLIED -₹{savedAmount}
                              </span>
                            )}
                            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                      </div>

                      <div className="mt-8">
                        <YouMayAlsoLike
                          products={recommendations}
                          onQuickView={setQuickViewProduct}
                        />
                      </div>
                    </>
                  )}
                </main>
              </div>

              <footer className="w-full flex-shrink-0 border-t bg-white">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                        defaultChecked
                      />
                      <div>
                        <Price
                          className="font-bold"
                          amount={cart?.cost.totalAmount.amount || '0'}
                          currencyCode={cart?.cost.totalAmount.currencyCode || 'USD'}
                        />
                        {isDiscountApplied && (
                          <p className="text-xs text-green-600">Saved: ₹{savedAmount}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Summary</span>
                      <ChevronRightIcon className="h-4 w-4 rotate-[-90deg]" />
                    </div>
                  </div>
                  <form action={checkoutAction} className="mt-4">
                    <CheckoutButton totalQuantity={cart?.totalQuantity || 0} />
                  </form>
                </div>
              </footer>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      <CouponModal isOpen={isCouponsOpen} onClose={() => setIsCouponsOpen(false)} cartId={cart?.id} />
    </>
  );
}