'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/admin/header';

interface Coupon {
  id: number;
  code: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditCouponPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/coupons/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Coupon not found - show error and redirect
            setError('This coupon has been deleted or does not exist. Redirecting to main page...');
            setTimeout(() => {
              router.push('/hatsadmin/dashboard/coupons');
            }, 3000);
            return;
          }
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
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!coupon) return;
    
    const { name, value, type } = e.target;
    setCoupon({
      ...coupon,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'discount' || name === 'maxUses' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coupon) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: coupon.code,
          discount: coupon.discount,
          validFrom: coupon.validFrom,
          validUntil: coupon.validUntil,
          maxUses: coupon.maxUses,
          isActive: coupon.isActive
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update coupon');
      }

      // Success - redirect back to coupons list
      router.push('/hatsadmin/dashboard/coupons');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading coupon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Coupon Not Found</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-3">
                <button
                  onClick={() => router.push('/hatsadmin/dashboard/coupons')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Go to Coupons List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Coupon not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Header title="Edit Coupon" />
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={coupon.discount}
            onChange={handleChange}
            min="0"
            max="100"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Valid From</label>
          <input
            type="datetime-local"
            name="validFrom"
            value={coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Valid Until</label>
          <input
            type="datetime-local"
            name="validUntil"
            value={coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Uses</label>
          <input
            type="number"
            name="maxUses"
            value={coupon.maxUses}
            onChange={handleChange}
            min="0"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={coupon.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Active</label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/hatsadmin/dashboard/coupons')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCouponPage;