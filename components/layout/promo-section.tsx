import { Asset, Entry } from 'contentful';
import Image from 'next/image';
import Link from 'next/link';
import type { PromoSection as PromoSectionType } from '@/lib/contentful';

const ShopButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="border border-black bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
  >
    {children}
  </Link>
);

export function PromoSection({ item }: { item: Entry<PromoSectionType> }) {
  // Correctly cast complex Contentful types to simple strings for React
  const title = item.fields.title as string;
  const image = item.fields.image as Asset;
  const shopLink = item.fields.shopLink as string;
  const imageUrl = image?.fields?.file?.url;

  return (
    <section className="relative flex h-[calc(100vh-64px)] w-full items-center justify-center bg-neutral-100 text-black dark:bg-black dark:text-white">
      {imageUrl && (
        <div className="relative h-2/3 w-2/3">
          <Image
            src={`https:${imageUrl}`}
            alt={title || 'Promo Image'}
            className="object-contain"
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
          />
        </div>
      )}
      <div className="absolute bottom-20 z-10 flex flex-col items-center text-center">
        <h2 className="mb-6 text-4xl font-bold uppercase tracking-widest md:text-5xl">{title}</h2>
        {shopLink && <ShopButton href={shopLink}>Shop</ShopButton>}
      </div>
    </section>
  );
}