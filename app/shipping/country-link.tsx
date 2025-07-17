// app/shipping/country-link.tsx

'use client';

import { Country } from '@/lib/shopify/types';
import { useRouter } from 'next/navigation';

export function CountryLink({ country }: { country: Country }) {
  const router = useRouter();

  const handleClick = () => {
    // 1. Save the selected country's code to the browser's local storage
    localStorage.setItem('selectedCountry', country.isoCode);
    
    // 2. Navigate the user back to the previous page (the product page)
    router.back();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left py-3 px-2 hover:bg-gray-50"
    >
      {country.name}
    </button>
  );
}