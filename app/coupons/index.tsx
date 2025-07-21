import { getActiveCoupons } from '@/lib/contentful';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coupons',
  description: 'Check out our latest coupons and offers.'
};

export default async function CouponsPage() {
  const coupons = await getActiveCoupons();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Active Coupons</h1>
      {coupons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.sys.id}
              className="rounded-lg border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-black"
            >
              <h2 className="text-2xl font-semibold text-blue-600">{coupon.fields.title}</h2>
              <p className="my-2 text-neutral-600 dark:text-neutral-300">{coupon.fields.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold">Code:</p>
                <p className="rounded-md bg-neutral-100 px-3 py-1 font-mono text-lg dark:bg-neutral-900">
                  {coupon.fields.couponCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-neutral-500">No active coupons at the moment. Check back soon!</p>
      )}
    </div>
  );
}
