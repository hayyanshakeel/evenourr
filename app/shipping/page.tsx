// app/shipping/page.tsx

import { getAvailableShippingCountries } from '@/lib/shopify';
import { Country } from '@/lib/shopify/types';
import { BackButton } from './back-button'; // Import the new BackButton
import { CountryLink } from './country-link'; // Import the CountryLink component

// Helper function to group countries by their first letter
const groupCountries = (countries: Country[]) => {
  return countries.reduce((acc, country) => {
    const firstLetter = country.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter]?.push(country);
    return acc;
  }, {} as Record<string, Country[]>);
};

export default async function ShippingPage() {
  const availableCountries = await getAvailableShippingCountries();
  const groupedCountries = groupCountries(availableCountries);
  const alphabet = Object.keys(groupedCountries).sort();

  return (
    <div className="mx-auto max-w-lg bg-white min-h-screen">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-lg font-semibold">Shipping to</h1>
        </div>
      </div>
        
      <div className="p-4 bg-yellow-100/50 border-b">
        <div className="flex justify-between items-center">
            <span className="text-sm">Login to select your shipping address</span>
            <button className="font-bold text-sm">LOGIN</button>
        </div>
      </div>

      <div className="relative p-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search your country/region"
            className="w-full rounded-sm border border-neutral-300 py-2 px-3 pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-[1fr_20px] gap-4">
            {/* List of Countries */}
            <div>
                {alphabet.map((letter) => (
                  <div key={letter} id={`section-${letter}`} className="mb-4">
                    <h2 className="text-sm font-bold bg-gray-100 p-2">{letter}</h2>
                    <ul>
                      {groupedCountries[letter]?.map((country) => (
                        <li key={country.isoCode} className="border-b">
                           <CountryLink country={country} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>

            {/* A-Z Index */}
            <aside>
                <ul className="sticky top-24 text-center text-xs text-gray-500">
                    <li className='font-bold text-gray-800'>#</li>
                    {alphabet.map((letter) => (
                    <li key={letter} className="py-0.5">
                        <a href={`#section-${letter}`} className="hover:underline">
                        {letter}
                        </a>
                    </li>
                    ))}
                </ul>
            </aside>
        </div>
      </div>
    </div>
  );
}