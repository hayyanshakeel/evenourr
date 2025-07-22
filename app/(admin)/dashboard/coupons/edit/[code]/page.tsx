'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/admin/header';

interface Coupon {
  code: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  usageLimit: number | null;
}

const EditCouponPage = () => {
  const router = useRouter();
  const params = useParams();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/coupons/${code}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to fetch coupon data');
        }
        const data = await response.json();
        setCoupon(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (coupon) {
      setCoupon({ ...coupon, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coupon) return;
    try {
      setLoading(true);
      const payload = {
        ...coupon,
        discountValue: Number(coupon.discountValue),
        usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : null,
      };
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update coupon');
      router.push('/dashboard/coupons');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!coupon) return <div className="p-8 text-center">Coupon data could not be loaded.</div>;

  return (
    <div>
      <Header title={`Edit Coupon: ${coupon.code}`} />
      <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium">Discount Type</label>
              <select id="discountType" name="discountType" value={coupon.discountType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium">Discount Value</label>
              <input type="number" name="discountValue" id="discountValue" value={coupon.discountValue} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea name="description" id="description" rows={3} value={coupon.description || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="usageLimit" className="block text-sm font-medium">Usage Limit</label>
            <input type="number" name="usageLimit" id="usageLimit" value={coupon.usageLimit || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="border-t pt-6">
            <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponPage;