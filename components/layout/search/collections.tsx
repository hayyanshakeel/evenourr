// components/layout/search/collections.tsx
import { Suspense } from 'react';

import prisma from '@/lib/db';
import { Collection } from '@prisma/client';
import FilterList from './filter';

async function CollectionList() {
  // Fetch collections from your database instead of Shopify
  const collections = await prisma.collection.findMany();

  const list = collections.map((collection: Collection) => ({
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