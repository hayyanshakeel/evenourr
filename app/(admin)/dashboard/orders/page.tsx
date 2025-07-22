'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Order {
  id: number;
  orderNumber: string;
  email: string;
  status: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  total: number;
  createdAt: string;
  items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: number;
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getFinancialStatusBadge = (status: string | null) => {
    if (!status) return null;
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      partially_paid: 'bg-orange-100 text-orange-800',
      refunded: 'bg-red-100 text-red-800',
      voided: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order',
      render: (order: Order) => (
        <div>
          <div className="font-medium text-gray-900">{order.orderNumber}</div>
          <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
        </div>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (order: Order) => (
        <div className="text-sm text-gray-900">{order.email}</div>
      )
    },
    {
      key: 'items',
      label: 'Items',
      render: (order: Order) => (
        <div className="text-sm">
          <div>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</div>
          <div className="text-gray-500">
            {order.items.slice(0, 2).map(item => item.title).join(', ')}
            {order.items.length > 2 && '...'}
          </div>
        </div>
      )
    },
    {
      key: 'total',
      label: 'Total',
      render: (order: Order) => (
        <span className="font-medium">{formatCurrency(order.total)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => (
        <div className="space-y-1">
          {getStatusBadge(order.status)}
          {order.financialStatus && getFinancialStatusBadge(order.financialStatus)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/dashboard/orders/${order.id}`);
            }}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            title="View details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {order.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(order.id, 'processing');
              }}
              className="rounded p-1 text-green-600 hover:bg-green-50 hover:text-green-700"
              title="Mark as processing"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
          )}
          {['pending', 'processing'].includes(order.status) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to cancel this order?')) {
                  handleStatusUpdate(order.id, 'cancelled');
                }
              }}
              className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Cancel order"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <Header title="Orders" />

      <div className="mt-6 flex gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search orders..."
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
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="No orders found"
          onRowClick={(order) => router.push(`/admin/dashboard/orders/${order.id}`)}
          pagination={{
            ...pagination,
            onPageChange: (page) => setPagination(prev => ({ ...prev, page }))
          }}
        />
      </div>
    </div>
  );
}
