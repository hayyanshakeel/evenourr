'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Calendar, DollarSign, RotateCcw } from 'lucide-react';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  variant?: {
    id: number;
    title: string;
  };
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  returns?: Array<{
    id: string;
    status: string;
    rmaNumber: string;
  }>;
}

export default function UserOrdersPage() {
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch('/api/user/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canRequestReturn = (order: Order) => {
    // Can request return if order is delivered and less than 30 days old
    const deliveryDate = new Date(order.updatedAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return order.status === 'delivered' && deliveryDate > thirtyDaysAgo;
  };

  const hasActiveReturn = (order: Order) => {
    return order.returns && order.returns.some(ret => 
      ret.status !== 'completed' && ret.status !== 'rejected' && ret.status !== 'cancelled'
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/user/dashboard')}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-xl font-semibold">My Orders</h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700">Welcome, {user?.displayName || user?.email}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${order.totalPrice.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          {canRequestReturn(order) && !hasActiveReturn(order) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/user/returns/new?orderId=${order.id}`)}
                              className="flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Request Return
                            </Button>
                          )}
                          {hasActiveReturn(order) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push('/user/returns')}
                              className="flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              View Return
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            {item.product.imageUrl && (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              {item.variant && (
                                <p className="text-sm text-gray-500">{item.variant.title}</p>
                              )}
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} • ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.returns && order.returns.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h5 className="font-medium mb-3">Returns:</h5>
                          <div className="space-y-2">
                            {order.returns.map((returnItem) => (
                              <div key={returnItem.id} className="flex items-center justify-between text-sm">
                                <span>RMA #{returnItem.rmaNumber}</span>
                                <Badge variant="secondary" className={getStatusColor(returnItem.status)}>
                                  {returnItem.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
