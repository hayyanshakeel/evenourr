'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// --- FIX: Added 'url' to the props interface ---
// The component was receiving a 'url' prop that was not defined in its types.
interface ShareButtonProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productImage: string;
  url: string; // This line was added
}

export function ShareButton({ isOpen, onClose, productTitle, productImage, url }: ShareButtonProps) {
  // You can use the 'url' prop to create sharing links
  const shareOptions = [
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(productTitle)}` },
    { name: 'Pinterest', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(productTitle)}` }
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* ... Dialog and Transition contents ... */}
        {/* This part remains the same */}
      </Dialog>
    </Transition.Root>
  );
}