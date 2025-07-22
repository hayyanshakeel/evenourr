'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// This interface must match the fields returned by your API
interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  usageCount: number;
  usageLimit: number | null;
  status: 'active' | 'disabled' | 'expired';
}

// A simple debounce hook to prevent excessive API calls while typing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CouponsPage = () => {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  const fetchCoupons = useCallback(async (search: string) => {
    try {
      setLoading(true);
      const url = search ? `/api/coupons?search=${encodeURIComponent(search)}` : '/api/coupons';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      // Optionally set an error state here to show in the UI
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch coupons when the debounced search term changes
  useEffect(() => {
    fetchCoupons(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchCoupons]);

  const handleDeleteCoupon = async (couponCode: string) => {
    if (!confirm(`Are you sure you want to delete or disable the coupon "${couponCode}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/coupons/${couponCode}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to delete coupon');
      
      alert(result.message); // Show success message from API
      fetchCoupons(debouncedSearchTerm); // Refresh the data
    } catch (error) {
      console.error('Delete coupon error:', error);
      alert((error as Error).message);
    }
  };

  const getStatusBadge = (status: Coupon['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      disabled: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
    };
    return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  const columns = useMemo(() => [
    { key: 'code', label: 'Coupon Code', render: (c: Coupon) => <span className="font-mono font-medium">{c.code}</span> },
    { key: 'description', label: 'Description', render: (c: Coupon) => c.description || '—' },
    { key: 'discount', label: 'Discount', render: (c: Coupon) => (c.discountType === 'percentage' ? `${c.discountValue}%` : `$${(c.discountValue / 100).toFixed(2)}`) },
    { key: 'usage', label: 'Usage', render: (c: Coupon) => `${c.usageCount} / ${c.usageLimit || '∞'}` },
    { key: 'status', label: 'Status', render: (c: Coupon) => getStatusBadge(c.status) },
    { key: 'actions', label: 'Actions', render: (c: Coupon) => (
        <div className="flex items-center gap-2">
          <button onClick={() => router.push(`/dashboard/coupons/edit/${c.code}`)} className="rounded p-1 text-gray-600 hover:bg-gray-100"><PencilIcon className="h-4 w-4" /></button>
          <button onClick={() => handleDeleteCoupon(c.code)} className="rounded p-1 text-red-600 hover:bg-red-50"><TrashIcon className="h-4 w-4" /></button>
        </div>
    )},
  ], [router]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header title="Coupons" />
        <button onClick={() => router.push('/dashboard/coupons/new')} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" /> Add Coupon
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
        />
      </div>

      <div className="mt-6">
        <DataTable columns={columns} data={coupons} loading={loading} onRowClick={(c) => router.push(`/dashboard/coupons/edit/${c.code}`)} emptyMessage="No coupons found." />
      </div>
    </div>
  );
};

export default CouponsPage;