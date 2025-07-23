import { Suspense } from 'react';
import { Carousel } from '@/components/carousel';
import { ThreeItemGrid } from '@/components/grid/three-items';
import Footer from '@/components/layout/footer';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Turso.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Suspense>
        <Carousel />
      </Suspense>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}