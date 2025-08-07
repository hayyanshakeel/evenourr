'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Package, Calendar, AlertCircle } from 'lucide-react';

interface Return {
  id: string;
  rmaNumber: string;
  orderId: number;
  status: string;
  reason: string;
  description?: string;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  returnItems: Array<{
    id: string;
    quantity: number;
    orderItem: {
      id: number;
      product: {
        id: number;
        name: string;
        imageUrl?: string;
      };
      variant?: {
        id: number;
        title: string;
      };
      price: number;
    };
  }>;
}

export default function UserReturnsPage() {
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch('/api/user/returns', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReturns(data.returns || []);
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      received: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'processing':
      case 'shipped':
      case 'received':
        return <Package className="w-4 h-4" />;
      default:
        return <RotateCcw className="w-4 h-4" />;
    }
  };

  const getStatusDescription = (status: string) => {
    const descriptions: { [key: string]: string } = {
      pending: 'Your return request is being reviewed by our team.',
      approved: 'Your return has been approved. Please ship the items back.',
      processing: 'We are processing your return.',
      shipped: 'Return items are in transit to us.',
      received: 'We have received your returned items.',
      completed: 'Your return is complete and refund has been processed.',
      rejected: 'Your return request has been rejected.',
      cancelled: 'This return has been cancelled.',
    };
    return descriptions[status] || 'Status unknown';
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
                <h1 className="text-xl font-semibold">My Returns</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push('/user/orders')}
                  variant="outline"
                >
                  View Orders
                </Button>
                <span className="text-gray-700">Welcome, {user?.displayName || user?.email}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {returns.length === 0 ? (
              <div className="text-center py-12">
                <RotateCcw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No returns yet</h3>
                <p className="text-gray-500 mb-6">You haven't requested any returns yet.</p>
                <Button
                  onClick={() => router.push('/user/orders')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  View Orders
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {returns.map((returnItem) => (
                  <Card key={returnItem.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Return #{returnItem.rmaNumber}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(returnItem.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              Order #{returnItem.orderId}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(returnItem.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(returnItem.status)}
                            {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Status Description */}
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 font-medium mb-1">Status Update</p>
                        <p className="text-blue-700 text-sm">{getStatusDescription(returnItem.status)}</p>
                      </div>

                      {/* Return Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium mb-2">Return Reason</h4>
                          <p className="text-gray-600 text-sm">{returnItem.reason}</p>
                          {returnItem.description && (
                            <div className="mt-3">
                              <h5 className="font-medium mb-1">Description</h5>
                              <p className="text-gray-600 text-sm">{returnItem.description}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Refund Amount</h4>
                          <p className="text-2xl font-bold text-green-600">${returnItem.refundAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Returned Items */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Returned Items</h4>
                        <div className="space-y-3">
                          {returnItem.returnItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                              {item.orderItem.product.imageUrl && (
                                <img
                                  src={item.orderItem.product.imageUrl}
                                  alt={item.orderItem.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-medium">{item.orderItem.product.name}</h5>
                                {item.orderItem.variant && (
                                  <p className="text-sm text-gray-500">{item.orderItem.variant.title}</p>
                                )}
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.orderItem.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {returnItem.adminNotes && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-800 mb-2">Admin Notes</h4>
                          <p className="text-yellow-700 text-sm">{returnItem.adminNotes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 flex gap-3">
                        {returnItem.status === 'pending' && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement cancel return functionality
                              console.log('Cancel return:', returnItem.id);
                            }}
                          >
                            Cancel Return
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/user/orders`)}
                        >
                          View Original Order
                        </Button>
                      </div>
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
