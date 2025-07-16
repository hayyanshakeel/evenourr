'use client';

// Reverted the import back to the original 'Share2' icon
import { Share2 } from 'lucide-react';
import { useState } from 'react';
import { ShareModal } from './share-modal';

export function ShareButton({ productTitle, productImage }: { productTitle: string; productImage: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Share product"
        className="p-2 text-black hover:text-neutral-600"
      >
        {/* Using the original Share2 icon */}
        <Share2 size={20} />
      </button>

      {/* The existing ShareModal functionality remains the same */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productTitle={productTitle}
        productImage={productImage}
      />
    </>
  );
}