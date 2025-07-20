'use client';

import { ReactNode } from 'react';

export function SlideUpPanel({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="inline-block transform overflow-hidden rounded-t-lg bg-white text-left align-bottom shadow-xl transition-all sm:align-middle">
          {children}
        </div>
      </div>
    </div>
  );
}
