// app/shipping/back-button.tsx

'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="text-2xl mr-4">
      &larr;
    </button>
  );
}