// app/[page]/page.tsx

import { notFound } from 'next/navigation';

export default function Page({ params }: { params: { page: string } }) {
  // This is a placeholder page.
  // The original content system (Contentlayer) was not set up and causing errors.
  // You can implement a dynamic page system here later if needed.

  // For now, it will just show a "Not Found" message to prevent crashes.
  notFound();

  return (
    <section>
      <div className="container py-12">
        <h1 className="mb-4 text-4xl font-bold">Page</h1>
        <p>This is a dynamic page for: {params.page}</p>
      </div>
    </section>
  );
}