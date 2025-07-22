// app/(admin)/dashboard/coupons/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';

export default function CouponsPage() {
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCoupons() {
      const res = await db.select().from(coupons);
      setCouponsList(res);
    }
    fetchCoupons();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Coupons</h1>
      <ul className="mt-4">
        {couponsList.map((coupon) => (
          <li key={coupon.id} className="mb-2">
            {coupon.code} - {coupon.type} - {coupon.value}
          </li>
        ))}
      </ul>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={() => router.push('/dashboard/coupons/new')}
      >
        Create New Coupon
      </button>
    </div>
  );
}