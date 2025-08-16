// app/[page]/page.tsx
import prisma from '@/lib/db';
import { CmsRenderer } from '@/components/cms/Renderer';
import { DEFAULT_LAYOUT } from '@/lib/cms/schema';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const layout = await prisma.cmsLayout.findFirst({ where: { slug: page, published: true } });
  if (!layout) return notFound();
  const data = (layout.data as any) ?? DEFAULT_LAYOUT;
  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <CmsRenderer layout={data} />
      </div>
    </section>
  );
}