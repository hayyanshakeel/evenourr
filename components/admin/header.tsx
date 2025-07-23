import { ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void; // Make onMenuClick optional
  children?: ReactNode;
}

export default function Header({ title, onMenuClick, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Only show the button if the function is provided */}
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden">
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
      </div>
      <div>{children}</div>
    </header>
  );
}