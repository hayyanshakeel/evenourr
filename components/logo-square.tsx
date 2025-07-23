// File: components/logo-square.tsx

'use client'; // This ensures the component runs on the client

import LogoIcon from 'components/icons/logo';
const { SITE_NAME } = process.env;

export default function LogoSquare() {
  return (
    <div className="flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black h-[40px] w-[40px] rounded-xl">
      <LogoIcon
        // This is the fix: We provide a fallback to prevent 'undefined'
        aria-label={SITE_NAME || 'Logo'}
        className="h-[16px] w-[16px]"
      />
    </div>
  );
}