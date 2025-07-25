import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Manage your product collections',
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  );
}
