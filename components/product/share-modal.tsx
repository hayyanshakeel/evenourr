// components/product/share-modal.tsx

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
                {/* FIX: Replaced the SVG path with a standard WhatsApp icon */}
                <ShareIcon
                  label="WhatsApp"
                  onClick={() => window.open(socialLinks.whatsapp, '_blank')}
                  icon={
                    <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.11 4.9C17.22 3 14.72 2 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.75 1.21h.01c5.52 0 10-4.48 10-10 0-2.72-1.01-5.22-2.9-7.1zM12 20.21c-1.53 0-2.98-.4-4.24-1.12l-.3-.18-3.18.84.86-3.11-.2-.31c-.8-1.26-1.21-2.74-1.21-4.24 0-4.54 3.69-8.23 8.24-8.23 2.22 0 4.28.86 5.84 2.42 1.56 1.56 2.41 3.62 2.41 5.84-.02 4.54-3.7 8.23-8.22 8.23zM17 14.88c-.29-.14-1.72-.85-1.98-.94-.27-.1-.46-.14-.66.14s-.75.85-.92 1.02c-.17.17-.34.19-.63.06-.29-.12-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.62-1.98-.18-.27-.01-.42.12-.56.12-.12.27-.31.4-.42.14-.12.18-.2.27-.33.09-.14.04-.27-.02-.38-.06-.12-.66-1.58-.9-2.15s-.48-.48-.66-.49c-.18-.01-.38-.01-.58-.01s-.46.06-.7.3c-.24.24-.92.9-1.06 2.2s1.08 2.55 1.23 2.73c.15.17 2.2 3.49 5.34 4.71.75.29 1.34.46 1.8.58.71.18 1.36.12 1.87-.06.57-.2 1.72-1.12 1.96-1.52.24-.39.24-.73.18-.84-.07-.12-.26-.18-.55-.32z" />
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
