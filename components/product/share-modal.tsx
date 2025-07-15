'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Helper component for each share icon
const ShareIcon = ({
  icon,
  label,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
      {icon}
    </div>
    <span className="text-xs text-gray-600">{label}</span>
  </button>
);

export function ShareModal({
  isOpen,
  onClose,
  productTitle,
  productImage
}: {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productImage: string;
}) {
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(productUrl);
    alert('Link copied to clipboard!');
    onClose();
  };

  const socialLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${productTitle} - ${productUrl}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      productUrl
    )}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(productTitle)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      productUrl
    )}&text=${encodeURIComponent(productTitle)}`
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div className="fixed inset-x-0 bottom-0">
            <Dialog.Panel className="w-full rounded-t-lg bg-white p-4">
              <Dialog.Title className="text-center font-semibold">Share to</Dialog.Title>
              <div className="my-4 grid grid-cols-4 gap-4">
                {/* Corrected WhatsApp Icon */}
                <ShareIcon
                  label="WhatsApp"
                  onClick={() => window.open(socialLinks.whatsapp, '_blank')}
                  icon={
                    <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.75 13.96c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.23-.64.81-.78.97-.14.17-.28.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.4-1.72-.17-.25-.02-.38.11-.5.12-.12.25-.3.38-.45.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.84c-.2-.48-.41-.42-.56-.42-.14 0-.3-.01-.47-.01s-.39.06-.6.3c-.2.25-.79.76-.79 1.85S10.25 15 10.37 15.17c.12.17 1.54 2.45 3.75 3.3.55.22.99.35 1.32.45.49.14 1.24.12 1.7-.05.51-.17 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.17-.16-.37-.28zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
                    </svg>
                  }
                />
                <ShareIcon
                  label="Facebook"
                  onClick={() => window.open(socialLinks.facebook, '_blank')}
                  icon={
                    <svg className="h-7 w-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  }
                />
                {/* Corrected Pinterest Icon */}
                <ShareIcon
                  label="Pinterest"
                  onClick={() => window.open(socialLinks.pinterest, '_blank')}
                  icon={
                    <svg className="h-7 w-7 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.344-.595-2.2-2.4-2.2-3.816 0-3.037 2.296-6.042 6.522-6.042 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.29-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621C9.91 21.805 10.932 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  }
                />
                <ShareIcon
                  label="X"
                  onClick={() => window.open(socialLinks.twitter, '_blank')}
                  icon={
                    <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  }
                />
                <ShareIcon label="Copy Link" onClick={copyLink} icon={<svg className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>} />
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full rounded-md bg-gray-100 py-3 text-center font-semibold"
              >
                CANCEL
              </button>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}