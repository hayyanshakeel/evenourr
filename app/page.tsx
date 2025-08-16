import prisma from '@/lib/db';
import { CmsRenderer } from '@/components/cms/Renderer';
import { DEFAULT_LAYOUT } from '@/lib/cms/schema';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Turso.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const layout = await prisma.cmsLayout.findFirst({ where: { slug: 'home', published: true } });
  const data = (layout?.data as any) ?? DEFAULT_LAYOUT;
  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <CmsRenderer layout={data} />
      </div>
    </section>
  );
}