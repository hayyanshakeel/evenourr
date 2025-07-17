// FILE: app/policy/PolicyClient.tsx

'use client';

import { Disclosure, Tab } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import LoadingDots from '@/components/loading-dots';
import { getEstimatedDeliveryDate } from '@/lib/shiprocket/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

function PolicyAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Disclosure as="div" className="border-b">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between py-4 text-left text-lg">
            <span>{title}</span>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Disclosure.Button>
          <Disclosure.Panel className="pb-4 pr-12 text-base text-gray-600">{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export function PolicyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({ message: '', date: '' });
  const [isPending, startTransition] = useTransition();

  const defaultTabIndex = searchParams.get('tab') === 'refunds' ? 1 : 0;

  const handleCheckDelivery = async (pincodeToCheck: string) => {
    startTransition(async () => {
      const result = await getEstimatedDeliveryDate(pincodeToCheck);
      setDeliveryInfo(result);
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mb-8 flex items-center justify-center">
        <button onClick={() => router.back()} className="absolute left-0 text-2xl">
          &larr;
        </button>
        <h1 className="text-xl font-semibold uppercase tracking-wider">POLICY</h1>
      </div>

      <Tab.Group defaultIndex={defaultTabIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {['Shipping Policy', 'Returns & Refunds'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
                ${selected ? 'bg-white shadow' : 'text-gray-700 hover:bg-white/[0.6]'}`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="mb-6">
              <h3 className="text-lg font-medium">Want to check your order status?</h3>
              <p className="mt-1 text-gray-600">
                Click <a href="#" className="font-semibold underline">here</a> to find your tracking information and order details.
              </p>
            </div>
            <PolicyAccordion title="Check Delivery Date">
              <div className="mt-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="block w-full max-w-xs rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  maxLength={6}
                />
                <button
                  onClick={() => handleCheckDelivery(pincode)}
                  disabled={isPending || pincode.length !== 6}
                  className="w-full max-w-xs rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isPending ? <LoadingDots className="bg-white" /> : 'Check'}
                </button>
                <div className="mt-2 h-5 text-sm">
                  {deliveryInfo.message && (
                    <p className={deliveryInfo.date ? 'text-green-600' : 'text-red-600'}>
                      {deliveryInfo.message} {deliveryInfo.date && <span className="font-bold">{deliveryInfo.date}</span>}
                    </p>
                  )}
                </div>
              </div>
            </PolicyAccordion>
            <PolicyAccordion title="Customs Duties">
              <p>For international orders, customs duties and taxes may apply and are the responsibility of the customer upon delivery.</p>
            </PolicyAccordion>
          </Tab.Panel>
          <Tab.Panel>
             <PolicyAccordion title="Instant Refund Service">
                <p className="font-semibold">The Instant Refund Service is available to select customers and is non-transferable.</p>
                <p className="mt-2">The actual arrival time of the refund is based on the processing time of your payment institution. Once your refund has been issued, you will receive a confirmation email.</p>
            </PolicyAccordion>
             <PolicyAccordion title="Fees and Eligibility">
                <p className="font-semibold">Return Shipping Fee</p>
                <p className="mt-2">Shipping is at your cost. Please pack and ship the returned item(s) to our warehouse. To find the warehouse address for your return, please contact customer support.</p>
            </PolicyAccordion>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}