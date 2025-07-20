// FILE: components/cart/modal.tsx

'use client';

import Price from '@/components/price';
import { useCart } from '@/components/cart/cart-context';
import OpenCart from '@/components/cart/open-cart';
import { YouMayAlsoLike } from '@/components/product/you-may-also-like';
import { QuickView } from '@/components/product/quick-view';
import { CartItem, Product } from '@/lib/shopify/types';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useDrag } from '@use-gesture/react';
import clsx from 'clsx';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { getRecommendedProducts, redirectToCheckout } from './actions';
import { SummaryModal } from './summary-modal';

export default function CartModal() {
  const { cart, removeFromCart, selectedLineIds, toggleItemSelection, toggleSelectAll } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // This state now tracks the position of each swiped item
  const [swipePositions, setSwipePositions] = useState<Record<string, number>>({});
  const [isDraggingId, setIsDraggingId] = useState<string | null>(null);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // A refined drag handler for a smooth, one-directional swipe
  const bind = useDrag(
    ({ args: [itemId], down, movement: [mx], velocity: [vx], cancel }) => {
      const typedItemId = itemId as string;

      if (down && mx < 0) {
        setIsDraggingId(typedItemId);
        setSwipePositions((prev) => ({ ...prev, [typedItemId]: mx }));
      } else if (!down) {
        setIsDraggingId(null);
        // If swiped past halfway or flicked with enough velocity, snap open
        const shouldOpen = mx < -96 || vx < -0.5;
        setSwipePositions((prev) => ({
          ...prev,
          [typedItemId]: shouldOpen ? -192 : 0
        }));
      }
    },
    {
      axis: 'x',
      bounds: { left: -192, right: 0 }
    }
  );

  const handleDelete = (item: CartItem) => {
    removeFromCart(item.id);
  };

  const handleMoveToWishlist = (item: CartItem) => {
    alert(`"${item.merchandise.product.title}" moved to wishlist!`);
    removeFromCart(item.id);
  };

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
    // Only open the cart automatically if the quantity changes from a known value.
    if (cart?.totalQuantity !== quantityRef.current && typeof quantityRef.current === 'number') {
      if (!isOpen && cart?.totalQuantity !== 0) {
        setIsOpen(true);
      }
    }

    // Always update the ref to the latest quantity.
    quantityRef.current = cart?.totalQuantity;
  }, [isOpen, cart?.totalQuantity]);

  // FIX: Reset swipe state when cart items change to prevent slider from getting stuck.
  useEffect(() => {
    setSwipePositions({});
    setIsDraggingId(null);
  }, [cart?.lines.length]);

  const checkoutAction = cart
    ? redirectToCheckout.bind(null, cart.id, Array.from(selectedLineIds))
    : undefined;

  const { selectedItemsTotal, selectedItemsCount } = useMemo(() => {
    if (!cart?.lines) {
      return { selectedItemsTotal: '0.00', selectedItemsCount: 0 };
    }

    let total = 0;
    let count = 0;

    cart.lines.forEach((item) => {
      if (selectedLineIds.has(item.id)) {
        total += parseFloat(item.cost.totalAmount.amount) * item.quantity;
        count += item.quantity;
      }
    });

    return { selectedItemsTotal: total.toFixed(2), selectedItemsCount: count };
  }, [cart, selectedLineIds]);

  const areAllItemsSelected = useMemo(() => {
    if (!cart?.lines || cart.lines.length === 0) {
      return false;
    }
    return selectedLineIds.size === cart.lines.length;
  }, [cart?.lines, selectedLineIds]);

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
                <button
                  onClick={() => {
                    closeCart();
                    setSwipePositions({}); // Reset swipe on close
                  }}
                  className="p-2"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold">SHOPPING BAG</h1>
                <div className="flex items-center gap-4">
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
                          <li
                            key={item.id}
                            className="group relative w-full overflow-hidden rounded-lg border"
                          >
                            <div className="absolute top-0 right-0 z-0 flex h-full">
                              <button
                                onClick={() => handleMoveToWishlist(item)}
                                className="flex h-full w-24 flex-col items-center justify-center gap-1 bg-yellow-400 p-2 text-xs font-medium text-black"
                              >
                                <HeartIcon className="h-5 w-5" />
                                <span className="text-center leading-tight">Move to Wishlist</span>
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="flex h-full w-24 flex-col items-center justify-center gap-1 bg-red-500 p-2 text-xs font-medium text-white"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span>Delete</span>
                              </button>
                            </div>
                            <div
                              {...bind(item.id)}
                              id={item.id}
                              style={{
                                transform: `translateX(${swipePositions[item.id] || 0}px)`,
                                touchAction: 'pan-y'
                              }}
                              className={clsx(
                                'relative z-10 w-full cursor-grab bg-white active:cursor-grabbing',
                                {
                                  'transition-transform duration-300 ease-out':
                                    isDraggingId !== item.id
                                }
                              )}
                            >
                              <div className="flex w-full items-start gap-4 p-4">
                                <input
                                  type="checkbox"
                                  className="mt-1 h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                                  checked={selectedLineIds.has(item.id)}
                                  onChange={() => toggleItemSelection(item.id)}
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
                                  <h3 className="font-semibold">
                                    {item.merchandise.product.title}
                                  </h3>
                                  <Price
                                    className="mt-1 font-bold"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={item.cost.totalAmount.currencyCode}
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.merchandise.title}
                                  </p>
                                </div>
                                <div
                                  className={clsx(
                                    'absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 transition-opacity',
                                    { 'opacity-0': (swipePositions[item.id] ?? 0) < 0 }
                                  )}
                                >
                                  <ChevronLeftIcon className="h-5 w-5 animate-pulse" />
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

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
                        checked={areAllItemsSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                      />
                      <Price
                        className="font-bold"
                        amount={selectedItemsTotal}
                        currencyCode={cart?.cost?.totalAmount?.currencyCode || 'USD'}
                      />
                    </div>
                    <button
                      onClick={() => setIsSummaryOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm font-semibold">Summary</span>
                      <ChevronRightIcon className="h-4 w-4 rotate-[-90deg]" />
                    </button>
                  </div>
                  <form action={checkoutAction} className="mt-4">
                    <button
                      type="submit"
                      disabled={selectedItemsCount === 0}
                      className="w-full rounded-full bg-black p-4 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-neutral-400"
                    >
                      CHECKOUT ({selectedItemsCount})
                    </button>
                  </form>
                </div>
              </footer>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      {/* Quick View Modal for "You May Also Like" */}
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      {/* Summary Modal */}
      <SummaryModal isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} cart={cart} />
    </>
  );
}