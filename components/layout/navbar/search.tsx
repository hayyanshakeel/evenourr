'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { useUser } from '@/hooks/useUser';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export default function Search() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { trackSearch, trackEngagement } = useBehaviorTracking({ userId: user?.id });
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (formData: FormData) => {
    const query = formData.get('q') as string;
    if (query && query.trim()) {
      // Track the search
      trackSearch(query.trim());
    }
  };

  const handleInputFocus = () => {
    trackEngagement('search_focus', {
      elementType: 'search_input'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Track search input engagement (typing behavior)
    if (e.target.value.length > 2) {
      trackEngagement('search_typing', {
        query_length: e.target.value.length,
        partial_query: e.target.value.substring(0, 10) // First 10 chars for analysis
      });
    }
  };

  return (
    <Form action={handleSearch} className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        ref={searchInputRef}
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        className="text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
