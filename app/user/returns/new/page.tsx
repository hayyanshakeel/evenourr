'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Package, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  orderItems: OrderItem[];
}

interface ReturnItem {
  orderItemId: number;
  quantity: number;
}

const RETURN_REASONS = [
  'Defective/Damaged',
  'Wrong item received',
  'Item not as described',
  'Size/fit issues',
  'No longer needed',
  'Arrived too late',
  'Quality issues',
  'Other'
];

function NewReturnForm() {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async (orderIdParam: string) => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch(`/api/user/orders/${orderIdParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        toast.error('Order not found or access denied');
        router.push('/user/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelection = (orderItemId: number, selected: boolean, maxQuantity: number) => {
    if (selected) {
      setReturnItems(prev => [...prev, { orderItemId, quantity: 1 }]);
    } else {
      setReturnItems(prev => prev.filter(item => item.orderItemId !== orderItemId));
    }
  };

  const handleQuantityChange = (orderItemId: number, quantity: number) => {
    setReturnItems(prev =>
      prev.map(item =>
        item.orderItemId === orderItemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const calculateRefundAmount = () => {
    if (!order) return 0;
    
    return returnItems.reduce((total, returnItem) => {
      const orderItem = order.orderItems.find(oi => oi.id === returnItem.orderItemId);
      return total + (orderItem ? orderItem.price * returnItem.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (returnItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }
    
    if (!reason) {
      toast.error('Please select a return reason');
      return;
    }

    setSubmitting(true);
    
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch('/api/user/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order?.id,
          reason,
          description,
          returnItems,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Return request submitted! RMA #${data.return.rmaNumber}`);
        router.push('/user/returns');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit return request');
      }
    } catch (error) {
      console.error('Error submitting return:', error);
      toast.error('Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/user/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/user/orders')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
              <h1 className="text-xl font-semibold">Request Return</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Order Number</Label>
                    <p>#{order.id}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Order Date</Label>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Total Amount</Label>
                    <p>${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items to Return */}
            <Card>
              <CardHeader>
                <CardTitle>Select Items to Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => {
                    const isSelected = returnItems.some(ri => ri.orderItemId === item.id);
                    const returnItem = returnItems.find(ri => ri.orderItemId === item.id);
                    
                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleItemSelection(item.id, checked as boolean, item.quantity)
                          }
                        />
                        
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
                            Original quantity: {item.quantity} • ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`quantity-${item.id}`} className="text-sm">
                              Return quantity:
                            </Label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={returnItem?.quantity || 1}
                              onChange={(e) => 
                                handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                              }
                              className="w-20"
                            />
                          </div>
                        )}
                        
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Return Details */}
            <Card>
              <CardHeader>
                <CardTitle>Return Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reason for Return *</Label>
                  <Select value={reason} onValueChange={setReason} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {RETURN_REASONS.map((reasonOption) => (
                        <SelectItem key={reasonOption} value={reasonOption}>
                          {reasonOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide any additional details about your return..."
                    rows={4}
                  />
                </div>

                {returnItems.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Refund Summary</h4>
                    </div>
                    <p className="text-green-700">
                      Expected refund amount: <span className="font-bold">${calculateRefundAmount().toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Refund will be processed to your original payment method within 5-7 business days after we receive your return.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/user/orders')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || returnItems.length === 0 || !reason}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {submitting ? 'Submitting...' : 'Submit Return Request'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NewReturnPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <NewReturnForm />
      </Suspense>
    </ProtectedRoute>
  );
}
