import Footer from 'components/layout/footer';
import { Hero } from 'components/layout/hero';
import { PromoSection } from 'components/layout/promo-section';
import { getHomepagePromoSections } from '@/lib/contentful';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const promoSections = await getHomepagePromoSections();

  return (
    <>
      <Hero />
      {promoSections.map((section) => (
        <PromoSection key={section.sys.id} item={section} />
      ))}
      <Footer />
    </>
  );
}