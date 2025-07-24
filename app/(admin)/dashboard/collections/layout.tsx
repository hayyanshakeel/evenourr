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
  return children;
}
