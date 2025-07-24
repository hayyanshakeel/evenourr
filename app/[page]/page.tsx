// app/[page]/page.tsx

import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  // This is a placeholder page.
  // The original content system (Contentlayer) was not set up and causing errors.
  // You can implement a dynamic page system here later if needed.

  const { page } = await params;

  // For now, it will just show a "Not Found" message to prevent crashes.
  notFound();

  return (
    <section>
      <div className="container py-12">
        <h1 className="mb-4 text-4xl font-bold">Page</h1>
        <p>This is a dynamic page for: {page}</p>
      </div>
    </section>
  );
}