// FILE: components/cart/modal.tsx

'use client';

import Price from '@/components/price';
import { DEFAULT_OPTION } from '@/lib/constants';
import { redirectToCheckout } from '@/lib/shopify';
import type { CartItem } from '@/lib/shopify/types';
import { Dialog, Tab, Transition } from '@headlessui/react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  HeartIcon,
  ShoppingCartIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { applyDiscount } from './actions';
import { DeleteItemButton } from './delete-item-button';
import { useCart } from './cart-context';
import OpenCart from './open-cart';
import { getPublicCoupons } from 'lib/shopify';

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
  
  // FIX: Update state to hold the new response object
  const [couponState, setCouponState] = useState<{
    loading: boolean;
    coupons: string[];
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

  const isDiscountApplied = cart && cart.cost.totalAmount.amount !== cart.cost.subtotalAmount.amount;
  const discountAmount = isDiscountApplied
    ? (parseFloat(cart.cost.subtotalAmount.amount) - parseFloat(cart.cost.totalAmount.amount)).toString()
    : '0';

  return (
    <>
      <div onClick={openCart}><OpenCart quantity={cart?.totalQuantity} /></div>
      <Transition show={isOpen}>{/* ... Main Cart Dialog ... */}</Transition>

      <Transition show={isCouponsOpen} as={Fragment}>
        <Dialog onClose={() => setIsCouponsOpen(false)} className="relative z-[51]">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/30" /></Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-6">
              <Dialog.Title className="text-lg font-semibold">Available Coupons</Dialog.Title>
              <div className="mt-4 max-h-64 space-y-4 overflow-y-auto">
                {/* FIX: Update JSX to show loading state, error, or coupons */}
                {couponState.loading ? (
                  <p>Loading coupons...</p>
                ) : couponState.error ? (
                  <p className="text-red-600">{couponState.error}</p>
                ) : couponState.coupons.length > 0 ? (
                  couponState.coupons.map(code => (
                    <button key={code} onClick={() => handleCouponSelect(code)} className="w-full rounded-lg border p-4 text-left hover:bg-gray-50">
                      <p className="font-bold text-green-600">{code}</p>
                      <p className="text-sm text-gray-600">Click to apply this coupon</p>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No public coupons are available at this time.</p>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}