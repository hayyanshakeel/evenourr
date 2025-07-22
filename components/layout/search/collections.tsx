import { db } from '@/lib/turso';
import { categories }from '@/lib/schema';
import FilterList from './filter';
import { Suspense } from 'react';

async function CollectionList() {
  const allCategories = await db.select().from(categories).all();
  const collections = allCategories.map(category => ({
    title: category.name,
    path: `/search/${category.slug}`
  }));

  return <FilterList list={[{ title: 'All', path: '/search' }, ...collections]} title="Collections" />;
}

export default function Collections() {
  return (
    <Suspense fallback={<div>Loading collections...</div>}>
      <CollectionList />
    </Suspense>
  );
}