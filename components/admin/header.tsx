import { ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void; // Make onMenuClick optional
  children?: ReactNode;
}

export default function Header({ title, onMenuClick, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger always visible on mobile */}
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden mr-2">
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 truncate max-w-xs sm:max-w-none">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}