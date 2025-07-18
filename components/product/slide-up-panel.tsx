// FILE: components/product/slide-up-panel.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment } from 'react';

export function SlideUpPanel({
  isOpen,
  onClose,
  title,
  children,
  panelClassName
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  panelClassName?: string; // FIX: Add an optional className for the panel
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
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
            <Dialog.Panel
              className={clsx(
                'flex w-full flex-col rounded-t-lg bg-white p-6',
                panelClassName || 'h-[85vh]' // Default to old height if no class is provided
              )}
            >
              <div className="flex flex-shrink-0 items-center justify-between">
                <Dialog.Title className="text-xl font-semibold uppercase">{title}</Dialog.Title>
                <button onClick={onClose} aria-label="Close panel">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 flex-grow overflow-y-auto">
                {children}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}