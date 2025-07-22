import { Asset, Entry } from 'contentful';
import Image from 'next/image';
import Link from 'next/link';
import type { PromoSection as PromoSectionType } from '@/lib/contentful';

export function PromoSection({ item }: { item: Entry<PromoSectionType> }) {
  const title = item.fields.title as string;
  const image = item.fields.image as Asset;
  const shopLink = item.fields.shopLink as string;
  const imageUrl = image?.fields?.file?.url;

  return (
    <section className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-neutral-100 py-16 text-black dark:bg-black dark:text-white">
      <Link href={shopLink || '#'} className="group block text-center">
        <h2 className="mb-6 text-4xl font-bold uppercase tracking-widest transition-opacity group-hover:opacity-70 md:text-5xl">
          {title}
        </h2>
        <div className="relative h-[50vh] w-screen max-w-4xl">
          {imageUrl && (
            <Image
              src={`https:${imageUrl}`}
              alt={title || 'Promo Image'}
              className="object-contain transition-transform group-hover:scale-105"
              fill
              sizes="(min-width: 1024px) 50vw, 80vw"
            />
          )}
        </div>
      </Link>
    </section>
  );
}