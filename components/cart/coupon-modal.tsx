// FILE: components/cart/coupon-modal.tsx

'use client';

import { applyDiscount } from '@/components/cart/actions';
import { getPublicCoupons } from '@/lib/shopify';
import { Dialog, Tab, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useEffect, useState, useTransition } from 'react';

// Define the Coupon type
type Coupon = {
  id: number;
  code: string;
  title: string;
  savedAmount: string;
  expiry: string;
};

export function CouponModal({
  isOpen,
  onClose,
  cartId
}: {
  isOpen: boolean;
  onClose: () => void;
  cartId: string | undefined;
}) {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [couponState, setCouponState] = useState<{
    loading: boolean;
    coupons: Coupon[];
    error?: string;
  }>({ loading: true, coupons: [], error: undefined });

  useEffect(() => {
    if (isOpen) {
      setCouponState({ loading: true, coupons: [], error: undefined });
      getPublicCoupons().then((result: { success: boolean; coupons: Coupon[]; error?: string }) => {
        if (result.success) {
          setCouponState({ loading: false, coupons: result.coupons, error: undefined });
        } else {
          setCouponState({ loading: false, coupons: [], error: result.error });
        }
      });
    }
  }, [isOpen]);

  const handleApplyPromo = (code: string) => {
    if (!cartId || !code) return;
    startTransition(async () => {
      const result = await applyDiscount(cartId, code);
      if (!result.success) {
        setPromoError(result.error || 'Failed to apply promo code.');
      } else {
        setPromoError(null);
        setPromoCode('');
        onClose();
      }
    });
  };

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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-gray-100">
            <div className="flex items-center justify-between border-b bg-white p-4">
              <Dialog.Title className="text-lg font-semibold">Coupons</Dialog.Title>
              <button onClick={onClose}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="coupons, store credit or gift card"
                  className="w-full border-r-0 border-gray-300 p-2 focus:border-gray-300 focus:ring-0"
                />
                <button
                  onClick={() => handleApplyPromo(promoCode)}
                  className="bg-gray-800 px-6 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                  disabled={!promoCode || isPending}
                >
                  APPLY
                </button>
              </div>
              {promoError && <p className="mt-2 text-sm text-red-500">{promoError}</p>}
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
                      <p className="text-center">Loading coupons...</p>
                    ) : couponState.error ? (
                      <p className="text-center text-red-600">{couponState.error}</p>
                    ) : couponState.coupons.length > 0 ? (
                      couponState.coupons.map((coupon) => (
                        <div
                          key={coupon.id}
                          className="relative flex cursor-pointer rounded-lg bg-blue-50 p-4"
                          onClick={() => handleApplyPromo(coupon.code)}
                        >
                          {/* Left Column */}
                          <div className="flex w-1/3 flex-col items-center justify-center pr-4">
                            <h3 className="text-xl font-bold text-blue-600">{coupon.title}</h3>
                            <p className="text-xs text-blue-500">SAVED ₹{coupon.savedAmount}</p>
                          </div>
                          {/* Right Column */}
                          <div className="w-2/3 border-l-2 border-dashed border-blue-200 pl-4">
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
                      <p className="text-center text-gray-500">No coupons available.</p>
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
  );
}