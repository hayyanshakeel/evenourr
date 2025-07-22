import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      <div>{children}</div>
    </div>
  );
}
