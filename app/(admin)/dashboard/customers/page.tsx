'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Customer {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: number;
  state: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
  addresses: Array<{
    id: number;
    address1: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, stateFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (stateFilter !== 'all') params.append('state', stateFilter);

      const response = await fetch(`/api/customers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCustomers();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStateBadge = (state: string) => {
    const colors: Record<string, string> = {
      enabled: 'bg-green-100 text-green-800',
      disabled: 'bg-red-100 text-red-800',
      invited: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[state] || 'bg-gray-100 text-gray-800'}`}>
        {state}
      </span>
    );
  };

  const getFullName = (customer: Customer) => {
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    }
    return customer.email.split('@')[0];
  };

  const getLocation = (customer: Customer) => {
    if (customer.addresses.length === 0) return '-';
    const address = customer.addresses[0];
    if (!address) return '-';
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.province) parts.push(address.province);
    if (address.country) parts.push(address.country);
    return parts.join(', ') || '-';
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (customer: Customer) => (
        <div>
          <div className="font-medium text-gray-900">{getFullName(customer)}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (customer: Customer) => (
        <div className="text-sm text-gray-900">{getLocation(customer)}</div>
      )
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (customer: Customer) => (
        <div className="text-sm">
          <div className="font-medium">{customer.ordersCount} orders</div>
          <div className="text-gray-500">{formatCurrency(customer.totalSpent)} spent</div>
        </div>
      )
    },
    {
      key: 'marketing',
      label: 'Marketing',
      render: (customer: Customer) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          customer.acceptsMarketing 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {customer.acceptsMarketing ? 'Subscribed' : 'Not subscribed'}
        </span>
      )
    },
    {
      key: 'state',
      label: 'Status',
      render: (customer: Customer) => getStateBadge(customer.state)
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (customer: Customer) => (
        <div className="text-sm text-gray-500">{formatDate(customer.createdAt)}</div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer: Customer) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/dashboard/customers/${customer.id}`);
          }}
          className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          title="View details"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header title="Customers" />
        <button
          onClick={() => router.push('/admin/dashboard/customers/new')}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
          Add Customer
        </button>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Search
          </button>
        </div>
        <select
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
          <option value="invited">Invited</option>
        </select>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          emptyMessage="No customers found"
          onRowClick={(customer) => router.push(`/admin/dashboard/customers/${customer.id}`)}
          pagination={{
            ...pagination,
            onPageChange: (page) => setPagination(prev => ({ ...prev, page }))
          }}
        />
      </div>
    </div>
  );
}
