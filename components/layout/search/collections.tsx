// components/layout/search/collections.tsx
import { Suspense } from 'react';

import { prisma } from '@/lib/db';
import FilterList from './filter';

async function CollectionList() {
  // Fetch categories from your database instead of Shopify
  const collections = await prisma.category.findMany();

  const list = collections.map((collection) => ({
    title: collection.title,
    path: `/search/${collection.handle}`,
  }));

  return <FilterList list={list} title="Collections" />;
}

const CollectionListWithSuspense = () => (
  <Suspense fallback={null}>
    <CollectionList />
  </Suspense>
);

export default CollectionListWithSuspense;