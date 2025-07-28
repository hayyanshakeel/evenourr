'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Simple toast notification
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 rounded-md px-4 py-2 text-white shadow-lg ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`}>
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">×</button>
    </div>
  </div>
);

// This interface must match the fields returned by your API
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
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [lastDeleteTime, setLastDeleteTime] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

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

  const handleDeleteCoupon = async (couponId: number) => {
    // Prevent multiple delete operations on the same coupon
    if (deletingIds.has(couponId)) {
      return;
    }

    // Client-side rate limiting: prevent deletes within 2 seconds of each other
    const now = Date.now();
    const timeSinceLastDelete = now - lastDeleteTime;
    if (timeSinceLastDelete < 2000) {
      showToast('Please wait a moment before deleting another coupon to avoid rate limiting.', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to delete this coupon? This action cannot be undone.`)) return;

    try {
      // Mark this coupon as being deleted
      setDeletingIds(prev => new Set([...prev, couponId]));
      setLastDeleteTime(now);

      const response = await fetch(`/api/coupons/${couponId}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again. The server allows up to 30 API operations per minute.');
        }
        
        let errorMessage;
        try {
          const result = await response.json();
          errorMessage = result.error || `Failed to delete coupon (Status: ${response.status})`;
        } catch {
          errorMessage = `Failed to delete coupon (Status: ${response.status})`;
        }
        throw new Error(errorMessage);
      }
      
      // Optimistically remove the coupon from the local state
      setCoupons(prevCoupons => prevCoupons.filter(c => c.id !== couponId));
      
      // Show success message
      showToast('Coupon deleted successfully!', 'success');
      
      // If we're currently viewing this coupon's edit page, redirect to main page
      if (window.location.pathname.includes(`/edit/${couponId}`)) {
        setTimeout(() => router.push('/hatsadmin/dashboard/coupons'), 1000);
      }
      
    } catch (error) {
      console.error('Delete coupon error:', error);
      showToast((error as Error).message, 'error');
    } finally {
      // Remove from deleting set
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (isActive: boolean, validUntil: string) => {
    const now = new Date();
    const expiryDate = new Date(validUntil);
    
    let status: string;
    let className: string;
    
    if (!isActive) {
      status = 'disabled';
      className = 'bg-yellow-100 text-yellow-800';
    } else if (expiryDate < now) {
      status = 'expired';
      className = 'bg-red-100 text-red-800';
    } else {
      status = 'active';
      className = 'bg-green-100 text-green-800';
    }
    
    return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${className}`}>{status}</span>;
  };

  const columns = useMemo(() => [
    { key: 'code', label: 'Coupon Code', render: (c: Coupon) => <span className="font-mono font-medium">{c.code}</span> },
    { key: 'discount', label: 'Discount', render: (c: Coupon) => `${c.discount}%` },
    { key: 'usage', label: 'Usage', render: (c: Coupon) => `${c.usedCount} / ${c.maxUses}` },
    { key: 'validUntil', label: 'Expires', render: (c: Coupon) => new Date(c.validUntil).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (c: Coupon) => getStatusBadge(c.isActive, c.validUntil) },
    { key: 'actions', label: 'Actions', render: (c: Coupon) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push(`/hatsadmin/dashboard/coupons/edit/${c.id}`)} 
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
            title="Edit coupon"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteCoupon(c.id)} 
            disabled={deletingIds.has(c.id)}
            className={`rounded p-1 ${
              deletingIds.has(c.id) 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-50'
            }`}
            title={deletingIds.has(c.id) ? 'Deleting...' : 'Delete coupon'}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
    )},
  ], [router, deletingIds, handleDeleteCoupon]);

  return (
    <div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="flex items-center justify-between">
        <Header title="Coupons" />
        <button onClick={() => router.push('/hatsadmin/dashboard/coupons/new')} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" /> Add Coupon
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by coupon code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
        />
      </div>

      <div className="mt-6">
        <DataTable columns={columns} data={coupons} loading={loading} onRowClick={(c) => router.push(`/hatsadmin/dashboard/coupons/edit/${c.id}`)} emptyMessage="No coupons found." />
      </div>
    </div>
  );
};

export default CouponsPage;