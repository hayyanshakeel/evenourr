// FILE: components/cart/modal.tsx

'use client';

import Price from '@/components/price';
import { DEFAULT_OPTION } from '@/lib/constants';
import type { CartItem } from '@/lib/shopify/types';
import { Dialog, Tab, Transition } from '@headlessui/react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  ShoppingCartIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getPublicCoupons } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { applyDiscount, redirectToCheckout } from './actions'; // CORRECTED IMPORT PATH
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import OpenCart from './open-cart';

// Define the Coupon type here as well to use in the component state
type Coupon = {
  id: number;
  code: string;
  title: string;
  savedAmount: string;
  expiry: string;
};

function CheckoutButton({ itemCount }: { itemCount: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-black p-4 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'PROCESSING...' : `CHECKOUT (${itemCount})`}
    </button>
  );
}

export default function CartModal() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);

  const [promoCode, setPromoCode] = useState('');
  const [isPending, startTransition] = useTransition();
  const [promoError, setPromoError] = useState<string | null>(null);

  const [isCouponsOpen, setIsCouponsOpen] = useState(false);

  const [couponState, setCouponState] = useState<{
    loading: boolean;
    coupons: Coupon[]; // Use the new Coupon type
    error?: string;
  }>({ loading: true, coupons: [], error: undefined });

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (isCouponsOpen) {
      setCouponState({ loading: true, coupons: [], error: undefined });
      getPublicCoupons()
        .then((result) => {
          if (result.success) {
            setCouponState({ loading: false, coupons: result.coupons, error: undefined });
          } else {
            setCouponState({ loading: false, coupons: [], error: result.error });
          }
        })
        .catch(() => {
          setCouponState({ loading: false, coupons: [], error: 'A client-side error occurred.' });
        });
    }
  }, [isCouponsOpen]);

  useEffect(() => {
    if (cart?.totalQuantity !== quantityRef.current) {
      if (!isOpen && cart?.totalQuantity !== 0) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const checkoutAction = cart ? redirectToCheckout.bind(null, cart.id) : null;

  const handleApplyPromo = async (code: string) => {
    if (!cart?.id || !code) return;
    startTransition(async () => {
      const result = await applyDiscount(cart.id, code);
      if (!result.success) {
        setPromoError(result.error || 'Failed to apply promo code.');
      } else {
        setPromoError(null);
        setPromoCode('');
      }
    });
  };

  const handleCouponSelect = (code: string) => {
    setPromoCode(code);
    setIsCouponsOpen(false);
    handleApplyPromo(code);
  };

  const isDiscountApplied =
    cart && cart.cost.totalAmount.amount !== cart.cost.subtotalAmount.amount;
  const discountAmount = isDiscountApplied
    ? (
        parseFloat(cart.cost.subtotalAmount.amount) - parseFloat(cart.cost.totalAmount.amount)
      ).toString()
    : '0';

  return (
    <>
      <div onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </div>
      <Transition show={isOpen}>{/* ... Main Cart Dialog ... */}</Transition>

      <Transition show={isCouponsOpen} as={Fragment}>
        <Dialog onClose={() => setIsCouponsOpen(false)} className="relative z-[51]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-gray-100">
              <div className="flex items-center justify-between border-b bg-white p-4">
                <Dialog.Title className="text-lg font-semibold">Coupons</Dialog.Title>
                <button onClick={() => setIsCouponsOpen(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="coupons, store credit or gift card"
                    className="w-full border-r-0 border-gray-300 p-2 focus:ring-0"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button
                    onClick={() => handleApplyPromo(promoCode)}
                    className="bg-gray-800 px-6 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                    disabled={!promoCode || isPending}
                  >
                    APPLY
                  </button>
                </div>
              </div>

              <Tab.Group>
                <Tab.List className="flex space-x-1 border-b bg-white px-1">
                  {['AVAILABLE', 'NOT AVAILABLE'].map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        clsx(
                          'w-full py-2.5 text-sm font-medium leading-5',
                          'focus:outline-none',
                          selected
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-black'
                        )
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2 p-4">
                  <Tab.Panel>
                    <div className="max-h-80 space-y-4 overflow-y-auto">
                      {couponState.loading ? (
                        <p>Loading coupons...</p>
                      ) : couponState.error ? (
                        <p className="text-red-600">{couponState.error}</p>
                      ) : couponState.coupons.length > 0 ? (
                        couponState.coupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="relative flex cursor-pointer rounded-lg bg-blue-50 p-4"
                            onClick={() => handleCouponSelect(coupon.code)}
                          >
                            <div className="w-1/3 border-r-2 border-dashed border-blue-200 pr-4 text-center">
                              <h3 className="text-xl font-bold text-blue-600">{coupon.title}</h3>
                              <p className="text-xs text-blue-500">SAVED ₹{coupon.savedAmount}</p>
                            </div>
                            <div className="w-2/3 pl-4">
                              <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-800">
                                RECOMMENDED
                              </span>
                              <p className="mt-1 text-xs font-medium text-gray-500">UNLIMITED</p>
                              <p className="mt-1 text-xs text-gray-400">
                                2025/07/17 - {coupon.expiry}
                              </p>
                              <div className="mt-2 flex items-center justify-between rounded-md bg-white p-2">
                                <span className="text-sm font-bold text-blue-600">
                                  COUPON: {coupon.code}
                                </span>
                                <DocumentDuplicateIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No public coupons are available at this time.</p>
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="text-center text-gray-500">
                      <p>No unavailable coupons at this time.</p>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}