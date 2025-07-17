// components/product/shipping-accordion.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';

// FIX: Hardcoded a list of countries directly in the component
const countries = [
  { name: 'Australia', isoCode: 'AU' },
  { name: 'Canada', isoCode: 'CA' },
  { name: 'China', isoCode: 'CN' },
  { name: 'France', isoCode: 'FR' },
  { name: 'Germany', isoCode: 'DE' },
  { name: 'India', isoCode: 'IN' },
  { name: 'Japan', isoCode: 'JP' },
  { name: 'South Korea', isoCode: 'KR' },
  { name: 'United Kingdom', isoCode: 'GB' },
  { name: 'United States', isoCode: 'US' }
  // Add more countries as needed
];

export function ShippingAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.isoCode === 'IN') || countries[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCountrySelect = (country: { name: string; isoCode: string }) => {
    setSelectedCountry(country);
    closeModal();
  };

  return (
    <>
      <div className="border border-neutral-300">
        <div className="p-4">
          <button
            onClick={openModal}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="font-semibold uppercase">SHIPPING TO {selectedCountry.name}</span>
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Delivery</span>
              </div>
              <div className="mt-2 ml-7 rounded-md bg-gray-50 p-3 text-gray-600">
                <p>Express shipping available</p>
                <p>Shipping Time: 8 - 12 days</p>
              </div>
            </div>
            <div className="flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5V4H4zm0 9h5v5H4v-5zm9-9h5v5h-5V4zm0 9h5v5h-5v-5z" />
              </svg>
              <span>Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900">
                    <span>Shipping to</span>
                    <button onClick={closeModal}><XMarkIcon className="h-5 w-5" /></button>
                  </Dialog.Title>
                  <div className="relative mt-4">
                    <input type="text" placeholder="Search your country/region" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded border border-gray-300 py-2 pl-10 pr-4" />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="mt-4 h-64 overflow-y-auto">
                    <ul>
                      {filteredCountries.map((country) => (
                        <li key={country.isoCode}>
                          <button onClick={() => handleCountrySelect(country)} className="w-full rounded p-2 text-left hover:bg-gray-100">
                            {country.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
