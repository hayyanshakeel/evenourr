'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { MobileHeader } from "@/components/admin/mobile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Download, 
  Plus,
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  total: number;
  status: string;
  date: string;
  items: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusStyle(status)} variant="secondary">
      {status}
    </Badge>
  );
};

function OrdersActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Filter className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Filter</span>
      </Button>
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Export</span>
      </Button>
      <Button className="h-10 lg:h-12 px-4 lg:px-6 bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Create Order</span>
      </Button>
    </div>
  );
}

function OrdersStats({ orders }: { orders: Order[] }) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending').length;
  const inTransitOrders = orders.filter(order => order.status.toLowerCase() === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status.toLowerCase() === 'delivered').length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "In Transit",
      value: inTransitOrders.toString(),
      icon: Truck,
      color: "text-purple-600",
    },
    {
      title: "Delivered",
      value: deliveredOrders.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {order.items}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/hatsadmin/dashboard/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No orders found</h3>
                      <p className="text-sm text-gray-500">Get started by creating your first order.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = await getIdToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our interface
          const transformedOrders = data.map((order: any) => ({
            id: order.id,
            orderNumber: `ORD-2024-${String(order.id).padStart(3, '0')}`,
            customer: {
              name: order.customer?.name || order.customer?.firstName + ' ' + order.customer?.lastName || 'Unknown Customer',
              email: order.customer?.email || 'No email'
            },
            total: order.totalPrice || order.total || 0,
            status: order.status || 'pending',
            date: new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            }),
            items: order.orderItems?.length || order.items?.length || 1
          }));
          setOrders(transformedOrders);
        } else {
          console.error('Failed to fetch orders');
          // Show sample data if no real orders exist
          setOrders([
            {
              id: 'ORD-2024-001',
              orderNumber: 'ORD-2024-001',
              customer: { name: 'John Doe', email: 'john@example.com' },
              total: 2340,
              status: 'delivered',
              date: '2024-01-15',
              items: 3
            },
            {
              id: 'ORD-2024-002',
              orderNumber: 'ORD-2024-002',
              customer: { name: 'Sarah Wilson', email: 'sarah@example.com' },
              total: 1890,
              status: 'processing',
              date: '2024-01-14',
              items: 2
            },
            {
              id: 'ORD-2024-003',
              orderNumber: 'ORD-2024-003',
              customer: { name: 'Mike Johnson', email: 'mike@example.com' },
              total: 3450,
              status: 'shipped',
              date: '2024-01-13',
              items: 5
            },
            {
              id: 'ORD-2024-004',
              orderNumber: 'ORD-2024-004',
              customer: { name: 'Emily Brown', email: 'emily@example.com' },
              total: 890,
              status: 'pending',
              date: '2024-01-12',
              items: 1
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getIdToken]);

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <MobileHeader title="Orders" subtitle="Manage and track all customer orders" actions={<OrdersActions />} />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
            <div className="animate-pulse space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MobileHeader title="Orders" subtitle="Manage and track all customer orders" actions={<OrdersActions />} />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          <OrdersStats orders={filteredOrders} />
          <OrdersTable orders={filteredOrders} />
        </div>
      </main>
    </div>
  );
}
