'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minimumPurchase: number | null;
  usageLimit: number | null;
  usageCount: number | null;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
  remainingUses?: number | null;
  isExpired?: boolean;
  isActive?: boolean;
}

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCoupons();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === 'percentage') {
      return `${value}%`;
    } else if (type === 'fixed_amount') {
      return `$${(value / 100).toFixed(2)}`;
    } else if (type === 'free_shipping') {
      return 'Free Shipping';
    }
    return '-';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (coupon.isExpired) {
      return <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">Expired</span>;
    }
    if (!coupon.isActive) {
      return <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">Inactive</span>;
    }
    if (coupon.status === 'disabled') {
      return <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">Disabled</span>;
    }
    return <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Active</span>;
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && coupon.isActive && !coupon.isExpired) ||
      (statusFilter === 'expired' && coupon.isExpired) ||
      (statusFilter === 'disabled' && coupon.status === 'disabled');
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (coupon: Coupon) => (
        <div>
          <div className="font-medium text-gray-900">{coupon.code}</div>
          {coupon.description && (
            <div className="text-sm text-gray-500">{coupon.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'discount',
      label: 'Discount',
      render: (coupon: Coupon) => (
        <span className="font-medium">
          {formatDiscount(coupon.discountType, coupon.discountValue)}
        </span>
      )
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (coupon: Coupon) => (
        <div className="text-sm">
          <div>{coupon.usageCount || 0} used</div>
          {coupon.usageLimit && (
            <div className="text-gray-500">of {coupon.usageLimit} limit</div>
          )}
        </div>
      )
    },
    {
      key: 'validity',
      label: 'Validity',
      render: (coupon: Coupon) => (
        <div className="text-sm">
          <div>From: {formatDate(coupon.startsAt)}</div>
          <div className="text-gray-500">To: {formatDate(coupon.endsAt)}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (coupon: Coupon) => getStatusBadge(coupon)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (coupon: Coupon) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/coupons/${coupon.code}/edit`);
            }}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCoupon(coupon.code);
            }}
            className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header title="Coupons" />
        <button
          onClick={() => router.push('/dashboard/coupons/new')}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
          Add Coupon
        </button>
      </div>

      <div className="mt-6 flex gap-4">
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredCoupons}
          loading={loading}
          emptyMessage="No coupons found"
          onRowClick={(coupon) => router.push(`/dashboard/coupons/${coupon.code}/edit`)}
        />
      </div>
    </div>
  );
}
