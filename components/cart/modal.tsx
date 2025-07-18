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
// FIX: Import 'getPublicCoupons' from the correct location
import { getPublicCoupons } from 'lib/shopify';

const AVAILABLE_COUPONS = [
  {
    code: 'SUMMER15',
    title: '15% OFF',
    subTitle: 'UNLIMITED',
    description: '15% off your entire order.',
    savedAmount: '60.30',
    validity: '2025/07/17 - 2025/08/16',
    isRecommended: true
  },
  {
    code: 'FREESHIP',
    title: 'FREE SHIPPING',
    subTitle: 'LIMITED',
    description: 'Free shipping on orders over ₹1,000.',
    savedAmount: '50.00',
    validity: '2025/07/01 - 2025/07/31',
    isRecommended: false
  }
];

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
  const [fetchedCoupons, setFetchedCoupons] = useState<string[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (isCouponsOpen) {
      setIsLoadingCoupons(true);
      getPublicCoupons()
        // FIX: Add 'string[]' type to the 'codes' parameter
        .then((codes: string[]) => {
          setFetchedCoupons(codes);
          setIsLoadingCoupons(false);
        })
        // FIX: Add 'any' type to the 'err' parameter
        .catch((err: any) => {
          console.error("Failed to fetch coupons:", err);
          setIsLoadingCoupons(false);
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
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child as={Fragment} enter="transition-all ease-in-out duration-300" enterFrom="opacity-0 backdrop-blur-none" enterTo="opacity-100 backdrop-blur-sm" leave="transition-all ease-in-out duration-200" leaveFrom="opacity-100 backdrop-blur-sm" leaveTo="opacity-0 backdrop-blur-none">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child as={Fragment} enter="transition-all ease-in-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transition-all ease-in-out duration-200" leaveFrom="translate-y-0" leaveTo="translate-y-full">
            <Dialog.Panel className="fixed inset-0 flex h-full w-full flex-col bg-gray-100 text-black">
              <div className="flex flex-shrink-0 items-center justify-between border-b bg-white p-4">
                <button aria-label="Go back" onClick={closeCart}><ArrowLeftIcon className="h-6" /></button>
                <p className="text-lg font-semibold">SHOPPING BAG</p>
                <div className="flex items-center gap-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <HeartIcon className="h-6 w-6" />
                </div>
              </div>
              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto">
                    <div className="bg-white p-4">
                      <ul className="space-y-4">
                        {cart.lines.map((item: CartItem) => (
                          <li key={item.id} className="flex w-full items-start gap-4"><input type="checkbox" className="mt-1 h-5 w-5 rounded" defaultChecked /><div className="h-24 w-20 flex-shrink-0"><Image className="h-full w-full object-cover" width={80} height={96} alt={item.merchandise.product.featuredImage?.altText || item.merchandise.product.title} src={item.merchandise.product.featuredImage?.url || ''}/></div><div className="flex-grow"><p className="text-sm">{item.merchandise.product.title}</p><Price className="text-sm font-semibold" amount={item.cost.totalAmount.amount} currencyCode={item.cost.totalAmount.currencyCode}/>{item.merchandise.title !== DEFAULT_OPTION && (<p className="mt-1 text-xs text-neutral-500">{item.merchandise.title}</p>)}</div><div className="flex-shrink-0"><HeartIcon className="h-5 w-5" /></div></li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 bg-white p-4">
                      <h3 className="font-semibold">ADD PROMO CODE</h3>
                      <form action={() => handleApplyPromo(promoCode)} className="mt-2 flex gap-2"><input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} type="text" placeholder="coupons, store credit or gift card" className="w-full rounded-md border-gray-300" /><button type="submit" disabled={isPending} className="rounded-md bg-gray-200 px-4 font-semibold disabled:opacity-50">{isPending ? '...' : 'APPLY'}</button></form>
                      {promoError && <p className="mt-2 text-sm text-red-600">{promoError}</p>}
                    </div>
                    <div className="mt-4 bg-white p-4">
                       <button onClick={() => setIsCouponsOpen(true)} className="flex w-full items-center">
                          <TagIcon className="h-6 w-6 text-gray-500" />
                          <span className="ml-2">Coupons</span>
                          <div className="ml-auto flex items-center gap-2">
                            {isDiscountApplied && (<><span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">PROMO APPLIED</span><Price className="text-blue-600" amount={discountAmount} currencyCode={cart.cost.totalAmount.currencyCode}/></>)}
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          </div>
                       </button>
                    </div>
                    <div className="mt-4 bg-white p-4">
                      <h3 className="text-center font-bold">YOU MAY ALSO LIKE</h3>
                      <div className="mt-4 h-32 w-full rounded-md bg-gray-100"></div>
                    </div>
                  </div>
                  {checkoutAction && (
                    <div className="flex-shrink-0 border-t bg-white p-4">
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <div><input type="checkbox" defaultChecked /><span className="ml-2">All</span></div>
                        <Price amount={cart.cost.totalAmount.amount} currencyCode={cart.cost.totalAmount.currencyCode} />
                      </div>
                      <form action={checkoutAction}><CheckoutButton itemCount={cart.totalQuantity} /></form>
                    </div>
                  )}
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      <Transition show={isCouponsOpen} as={Fragment}>
        <Dialog onClose={() => setIsCouponsOpen(false)} className="relative z-[51]">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/30" /></Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-6">
              <Dialog.Title className="text-lg font-semibold">Available Coupons</Dialog.Title>
              <div className="mt-4 max-h-64 space-y-4 overflow-y-auto">
                {isLoadingCoupons ? (<p>Loading coupons...</p>) : fetchedCoupons.length > 0 ? (fetchedCoupons.map(code => (<button key={code} onClick={() => handleCouponSelect(code)} className="w-full rounded-lg border p-4 text-left hover:bg-gray-50"><p className="font-bold text-green-600">{code}</p><p className="text-sm text-gray-600">Click to apply this coupon</p></button>))) : (<p className="text-gray-500">No public coupons are available at this time.</p>)}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}