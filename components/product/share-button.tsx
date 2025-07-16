'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { ShareModal } from './share-modal'; // Import your new modal

export function ShareButton({ productTitle, productImage }: { productTitle: string; productImage: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* This is the button that will open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Share product"
        className="p-2 text-gray-600 hover:text-black"
      >
        <Share2 size={20} />
      </button>

      {/* Here we render your ShareModal. 
        We pass it the state to control when it's open and the product info.
      */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productTitle={productTitle}
        productImage={productImage}
      />
    </>
  );
}